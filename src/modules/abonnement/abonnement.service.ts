import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeAbonnementEntity } from '../type-abonnement/entity/type-abonnement';
import { UserEntity } from '../user/entity/user.entity';
import { AbonnementEntity } from './entity/abonnement.entity';

@Injectable()
export class AbonnementService {
  constructor(
    @InjectRepository(AbonnementEntity)
    private readonly abonnementRepository: Repository<AbonnementEntity>,
    @InjectRepository(TypeAbonnementEntity)
    private readonly typeAbonnementRepository: Repository<TypeAbonnementEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  //Lister tous les abonnements
  async all(): Promise<any[]> {
    const abonnements = await this.abonnementRepository
      .createQueryBuilder('abonnement')
      .leftJoinAndSelect('abonnement.user', 'user')
      .leftJoinAndSelect('abonnement.typeAbonnement', 'typeAbonnement')
      .select([
        'abonnement.id',
        'abonnement.dateDebut',
        'abonnement.dateFin',
        'user.first_name',
        'user.last_name',
        'user.email',
        'typeAbonnement.id',
        'typeAbonnement.type',
        'typeAbonnement.tarif',
      ])
      .getMany();

    return abonnements;
  }

  //Trouver tous les utilisateurs par type d'abonnement
  async findAllUsersByType(id: number): Promise<any> {
    const type = await this.abonnementRepository.findOne({
      where: { id: id },
      select: ['typeAbonnement', 'user'],
      relations: ['typeAbonnement', 'user'],
    });
    console.log('type : ', type);
    return type;
  }

  // async findAllUsersById(id: number): Promise<UserEntity[]> {
  //   // Trouver l'abonnement par son ID avec les utilisateurs liés
  //   const abonnement = await this.abonnementRepository.findOne({
  //     where: { id },
  //     relations: ['users'],
  //   });

  //   if (!abonnement) {
  //     throw new Error(`Abonnement with ID ${id} not found`);
  //   }

  //   // Récupérer tous les utilisateurs associés à cet abonnement
  //   const users = abonnement.users;

  //   return users;
  // }



  //Création d'un abonnement
  async createAbonnement(
    userId: number,
    typeAbonnementId: number,
    dateDebut: Date,
    dateFin: Date,
  ): Promise<AbonnementEntity> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    const typeAbonnement = await this.typeAbonnementRepository.findOne({
      where: { id: typeAbonnementId },
    });
    if (!typeAbonnement) {
      throw new Error('Type Abonnement not found');
    }

    const abonnement = new AbonnementEntity();
    abonnement.user = user;
    abonnement.typeAbonnement = typeAbonnement;
    abonnement.dateDebut = dateDebut;
    abonnement.dateFin = dateFin;

    return await this.abonnementRepository.save(abonnement);
  }

  //Trouver les utitilsateurs par abonnements
  async findAllUsersByTypeAbonnement(typeId: number): Promise<any> {
    /*Chercher les abonnement par type d'abonnement*/
    const abonnements = await this.abonnementRepository.find({
      where: { typeAbonnement: { id: typeId } },
      relations: ['user', 'typeAbonnement'],
    });

    /*Trouver les utitilisateurs par abonnement*/
    const users = abonnements.map((abonnement) => abonnement.user);

    return users;
  }
}
