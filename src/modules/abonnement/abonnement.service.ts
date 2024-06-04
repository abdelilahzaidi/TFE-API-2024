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
        'typeAbonnement.type', // Assurez-vous que 'type' est le nom du champ que vous souhaitez dans TypeAbonnementEntity
        'typeAbonnement.tarif', // Assurez-vous que 'tarif' est le nom du champ que vous souhaitez dans TypeAbonnementEntity
      ])
      .getMany();

    return abonnements;
  }


  


  async findAllUsersByType(id: number): Promise<any> {

    const type = 
    await this.abonnementRepository.findOne({
      where:{id:id},
      select:['typeAbonnement','user'],
      relations:['typeAbonnement','user']
    })
    console.log('type : ',type)
    return type
  }

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


  async findAllUsersByTypeAbonnement(typeId: number): Promise<any> {
    // Trouver les abonnements par type d'abonnement
    const abonnements = await this.abonnementRepository.find({
      where: { typeAbonnement: { id: typeId } },
      relations: ['user', 'typeAbonnement'],
    });

    // Extraire les utilisateurs des abonnements
    const users = abonnements.map(abonnement => abonnement.user);

    return users;
  }
}
