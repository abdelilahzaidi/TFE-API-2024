import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateEventDto } from '../event/dto/event-create.dto';
import { EventEntity } from '../event/entity/event.entity';
import { UserEntity } from '../user/entity/user.entity';
import { SeanceUserEntity } from './entity/seance-user.entity';

@Injectable()
export class SeanceUserService {
    constructor(
        @InjectRepository(SeanceUserEntity) private readonly seanceUserEntity : Repository<SeanceUserEntity>,
        @InjectRepository(EventEntity) private readonly eventRepository: Repository<EventEntity>,
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
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
    
      async participateInEvent(eventId: number, userId: number): Promise<void> {
        const event = await this.eventRepository.findOne({ where: { id: eventId }, relations: ['users'] });
        if (!event) {
          throw new NotFoundException(`Event with ID ${eventId} not found`);
        }
    
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
          throw new NotFoundException(`User with ID ${userId} not found`);
        }
    
        if (event.users.find(u => u.id === user.id)) {
          throw new Error(`User with ID ${userId} is already participating in the event`);
        }
    
        event.users.push(user);
        await this.eventRepository.save(event);
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
}
