import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateEventDto } from '../event/dto/event-create.dto';
import { EventEntity } from '../event/entity/event.entity';
import { UserEntity } from '../user/entity/user.entity';
import { SeanceUserEntity } from './entity/seance-user.entity';
import { SeanceEntity } from '../seance/entity/seance.entity';


@Injectable()
export class SeanceUserService {
    constructor(
        @InjectRepository(SeanceUserEntity) private readonly seanceUserEntity : Repository<SeanceUserEntity>,
        @InjectRepository(EventEntity) private readonly eventRepository: Repository<EventEntity>,
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(SeanceEntity) private readonly seanceRepository: Repository<SeanceEntity>,
      ) {}

      async findAllSeanceUser(): Promise<SeanceUserEntity[]> {
        return await this.seanceUserEntity.find({ relations: ['user','seance'] });
      }


  
      async filterBySeanceId(seanceId: number): Promise<SeanceUserEntity[]> {
        try {
            const seanceUsers = await this.seanceUserEntity.createQueryBuilder('seanceUser')
                .innerJoinAndSelect('seanceUser.user', 'user')
                .innerJoinAndSelect('seanceUser.seance', 'seance')
                .innerJoinAndSelect('seance.cour', 'cour')           
                .innerJoinAndSelect('cour.lieu', 'lieu')                
                .where('seanceUser.seanceId = :seanceId', { seanceId })
                .getMany();
    
            if (!seanceUsers || seanceUsers.length === 0) {
                throw new NotFoundException(`Aucun utilisateur trouvé pour la séance avec l'ID ${seanceId}.`);
            }
    
            console.log('Seanceid', seanceId);
            console.log('Seance user', seanceUsers);
            return seanceUsers;
        } catch (error) {
            throw new InternalServerErrorException(
                `Une erreur est survenue lors de la récupération des utilisateurs pour la séance avec l'ID ${seanceId}.`,
                error.message,
            );
        }
    }  
    
    
      async findAll(): Promise<EventEntity[]> {
        return this.eventRepository.find({ relations: ['users'] });
      }


      async create(createEventDto: CreateEventDto): Promise<EventEntity> {
        const { nom, dateDebut, dateFin} = createEventDto;
    
        
    
        const event = this.eventRepository.create({ nom, dateDebut, dateFin });
        return this.eventRepository.save(event);
      }
    
      
    
      async delete(id: number): Promise<void> {
        const result = await this.eventRepository.delete(id);
        if (result.affected === 0) {
          throw new NotFoundException(`Event with ID ${id} not found`);
        }
      }
    
      async filterByDate(dateDebut: Date): Promise<EventEntity[]> {
        return this.eventRepository.find({
          where: {
            dateDebut,
          },
          relations: ['users'],
        });
      }
    
   

      async participateSeance(seanceId: number, userIds: number[]): Promise<SeanceUserEntity[]> {
          // Vérifier que userIds est un tableau et non vide
          if (!Array.isArray(userIds) || userIds.length === 0) {
              throw new BadRequestException(`La liste des IDs d'utilisateurs est vide ou mal formée`);
          }
      
          // Trouver la séance et s'assurer qu'elle existe
          const seance = await this.seanceRepository.findOne({ where: { id: seanceId } });
          if (!seance) {
              throw new NotFoundException(`Séance avec ID ${seanceId} non trouvée`);
          }
      
          // Trouver les utilisateurs par leurs IDs
          const users = await this.userRepository.findBy({
              id: In(userIds)
          });
          if (users.length === 0) {
              throw new NotFoundException(`Aucun utilisateur trouvé avec les IDs ${userIds}`);
          }
      
          // Créer une liste pour stocker les entités de participation
          const seanceUsers: SeanceUserEntity[] = [];
      
          // Boucle à travers les utilisateurs et créer une nouvelle entrée SeanceUserEntity
          for (const user of users) {
              // Vérifier si l'utilisateur participe déjà à cette séance
              const existingSeanceUser = await this.seanceUserEntity.findOne({
                  where: { seanceId: seanceId, userId: user.id }
              });
      
              if (existingSeanceUser) {
                  throw new Error(`L'utilisateur avec l'ID ${user.id} participe déjà à la séance`);
              }
      
              // Créer une nouvelle entrée dans SeanceUserEntity
              const seanceUser = this.seanceUserEntity.create({
                  seanceId: seanceId,
                  userId: user.id,
                  presence: false // Par défaut, l'utilisateur n'est pas encore marqué comme présent
              });
      
              seanceUsers.push(seanceUser);
          }
      
          // Sauvegarder toutes les nouvelles entrées de participation
          await this.seanceUserEntity.save(seanceUsers);
      
          // Retourner les entités créées
          return seanceUsers;
      }



      async participate(seanceId: number, userId: number): Promise<SeanceUserEntity> {
        try {
            // Vérifier si la séance existe
            const seance = await this.seanceRepository.findOne({ where: { id: seanceId } });
            if (!seance) {
                throw new NotFoundException(`Séance avec ID ${seanceId} non trouvée`);
            }
    
            // Vérifier si l'utilisateur existe
            const user = await this.userRepository.findOne({ where: { id: userId } });
            if (!user) {
                throw new NotFoundException(`Utilisateur avec ID ${userId} non trouvé`);
            }
    
            // Vérifier si l'utilisateur participe déjà à cette séance
            const existingSeanceUser = await this.seanceUserEntity.findOne({
                where: { seanceId: seanceId, userId: user.id }
            });
    
            if (existingSeanceUser) {
                throw new Error(`L'utilisateur avec l'ID ${user.id} participe déjà à la séance ${seance.id}`);
            }
    
            // Créer une nouvelle entrée dans SeanceUserEntity
            const seanceUser = this.seanceUserEntity.create({
                seanceId: seanceId,
                userId: user.id,
                presence: false // Par défaut, l'utilisateur n'est pas encore marqué comme présent
            });
    
            // Sauvegarder la nouvelle entrée
            await this.seanceUserEntity.save(seanceUser);
    
            // Retourner l'entité créée
            return seanceUser;
        } catch (error) {
            // Gérer et loguer l'erreur si nécessaire
            console.error('Erreur lors de la participation à la séance:', error.message);
            
            // Tu peux relancer l'erreur si tu souhaites la propager ou renvoyer une réponse plus spécifique
            throw new BadRequestException('Une erreur est survenue lors de l’inscription à la séance');
        }
    }
    
    
      
    
      
    
      



      async updatePresences(
        seanceId: number,
        userIds: number[],
        presence: boolean,
      ): Promise<SeanceUserEntity[]> {
        const updatePromises = userIds.map(async (userId) => {
          const seanceUser = await this.seanceUserEntity.findOne({
            where: { userId, seanceId },
          });
    
          if (seanceUser) {
            seanceUser.presence = presence;
            return this.seanceUserEntity.save(seanceUser);
          } else {
           
            return null;
          }
        });
    
        return Promise.all(updatePromises);
      }

     
      async updateUserPresence(seanceId: number, userIds: number[], presence: boolean): Promise<SeanceUserEntity[]> {
        const updatedUsers: SeanceUserEntity[] = [];
    
        for (const userId of userIds) {
          const seanceUser = await this.seanceUserEntity.findOne({
            where: { seanceId: seanceId, userId: userId },
          });
    
          if (!seanceUser) {
            throw new NotFoundException(`User with ID ${userId} not found for seance ${seanceId}`);
          }
    
          seanceUser.presence = presence;
          const updatedUser = await this.seanceUserEntity.save(seanceUser);
          updatedUsers.push(updatedUser);
        }    
       
        return updatedUsers;
      }



      async updateUserPresences(seanceId: number, seanceUsers: { userId: number, presence: boolean }[]): Promise<SeanceUserEntity[]> {
        if (!Array.isArray(seanceUsers)) {
          throw new TypeError('seanceUsers is not an array');
        }
      
        const updatedUsers: SeanceUserEntity[] = [];
      
        for (const { userId, presence } of seanceUsers) {
          // Vérification du type des données
          if (typeof userId !== 'number' || typeof presence !== 'boolean') {
            throw new TypeError('Invalid data format in seanceUsers');
          }
      
          // Cherche l'utilisateur pour la séance
          const seanceUser = await this.seanceUserEntity.findOne({
            where: { seanceId: seanceId, userId: userId },
          });
      
          if (!seanceUser) {
            throw new NotFoundException(`User with ID ${userId} not found for seance ${seanceId}`);
          }
      
          // Met à jour la présence de l'utilisateur
          seanceUser.presence = presence;
      
          // Sauvegarde la modification
          const updatedUser = await this.seanceUserEntity.save(seanceUser);
          updatedUsers.push(updatedUser);
        }
      
        return updatedUsers;
      }
      
      
}
