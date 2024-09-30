import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, MoreThanOrEqual, Repository } from 'typeorm';
import { TypeAbonnementEntity } from '../type-abonnement/entity/type-abonnement';
import { UserEntity } from '../user/entity/user.entity';
import { AbonnementEntity } from './entity/abonnement.entity';
import { RouteInfo } from '@nestjs/common/interfaces';
import { InvoiceEntity } from '../invoice/entity/invoice.entity';
import { SelectAbonnementDTO } from './dto/seleccted-abonnement.dto';
import { TypeAbonnementEnum } from 'src/common/enums/abonnement.enum';
import { AbonnementI } from './interface/abonnement.interfacte';

@Injectable()
export class AbonnementService {
  constructor(
    @InjectRepository(AbonnementEntity)
    private readonly abonnementRepository: Repository<AbonnementEntity>,
    @InjectRepository(TypeAbonnementEntity)
    private readonly typeAbonnementRepository: Repository<TypeAbonnementEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    @InjectRepository(InvoiceEntity)
    private readonly invoiceRepository: Repository<InvoiceEntity>,
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
    const abonnements = await this.abonnementRepository.find({
      where: { typeAbonnement: { id: typeId } },
      relations: ['user', 'typeAbonnement'],
    });

    const users = abonnements.map((abonnement) => abonnement.user);

    return users;
  }

  //Supprimer des abonnements
  async deleteAbonnement(id: number) {
    const abonnement = await this.abonnementRepository.findOne({
      where: { id },
      relations: ['invoices'],
    });

    if (!abonnement) {
      throw new NotFoundException(`Abonnement with ID ${id} not found`);
    }

    if (abonnement.invoices.length > 0) {
      await this.invoiceRepository.delete({ abonnement: { id } });
    }

    const result = await this.abonnementRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Abonnement with ID ${id} not found`);
    }

    return `Abonnement ${id} is deleted, along with related invoices!`;
  }

  async chooseAbonnement(
    selectAbonnementDTO: SelectAbonnementDTO,
  ): Promise<{ abonnement: AbonnementI; message: string }> {
    const {
      userId,
      typeAbonnementId,
      dateDebut: dateDebutStr,
      dateFin: dateFinStr,
    } = selectAbonnementDTO;

    const dateDebut = new Date(dateDebutStr);
    const dateFin = new Date(dateFinStr);

    console.log('Date de début:', dateDebut);
    console.log('Date de fin:', dateFin);

    const typeAbonnement = await this.typeAbonnementRepository.findOne({
      where: { id: typeAbonnementId },
    });
    if (!typeAbonnement) {
      throw new NotFoundException(
        `Type d'abonnement avec l'ID ${typeAbonnementId} non trouvé`,
      );
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`Utilisateur avec l'ID ${userId} non trouvé`);
    }

    const currentDate = new Date();

    const existingAbonnement = await this.abonnementRepository.findOne({
      where: {
        user,
        typeAbonnement: {
          type: In([TypeAbonnementEnum.ANNUEL, TypeAbonnementEnum.MENSUEL]),
        },
        dateFin: MoreThanOrEqual(currentDate),
      },
      relations: ['typeAbonnement'],
    });

    if (existingAbonnement) {
      throw new BadRequestException(
        `Vous avez déjà un abonnement de type ${existingAbonnement.typeAbonnement.type} en cours.`,
      );
    }

    if (typeAbonnement.type === TypeAbonnementEnum.ANNUEL) {
      const currentMonth = dateDebut.getMonth(); 
      console.log('Mois actuel (pour vérification):', currentMonth); 
      if (currentMonth !== 8) {
        
        throw new BadRequestException(
          'Vous pouvez choisir un abonnement annuel uniquement durant le mois de septembre.',
        );
      }
    }

    const abonnement = this.abonnementRepository.create({
      dateDebut,
      dateFin,
      typeAbonnement,
      user,
    });

    await this.abonnementRepository.save(abonnement);

    const abonnementI: AbonnementI = {
      id: abonnement.id,
      userId: user.id,
      typeAbonnementId: typeAbonnement.id,
      dateDebut: abonnement.dateDebut,
      dateFin: abonnement.dateFin,
    };

    return {
      abonnement: abonnementI,
      message: `Vous avez choisi un abonnement de type ${typeAbonnement.type}`,
    };
  }
}
