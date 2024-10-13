import {
  Body,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Param,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, DataSource, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { UserEntity } from '../user/entity/user.entity';
import { SeanceEntity } from './entity/seance.entity';
import { CourService } from '../cour/cour.service';
import { DateCourService } from '../date-cour/date-cour.service';

import { HoraireService } from '../horaire/horaire.service';
import { UserInfoDTO } from './dto/UserInfo.dto';
import { SeanceUserEntity } from '../seance-user/entity/seance-user.entity';
import { SeanceCreateDTO } from './dto/seance-create.dto';
import { SeanceUserService } from '../seance-user/seance-user.service';
import { CourEntity } from '../cour/entity/cour.entity';
import { DateCourEntity } from '../date-cour/entity/date.entity';
import { DayOfWeek, HoraireEntity } from '../horaire/entity/horaire.entity';
import { LieuEntity } from '../lieu/entity/lieu.entity';
import { UpdateSeanceDto } from './dto/seance-update.dto';

@Injectable()
export class SeanceService {
  private readonly logger = new Logger(SeanceService.name);
  constructor(
    @InjectRepository(SeanceEntity)
    private readonly seanceRepository: Repository<SeanceEntity>,
    private readonly dateCourService: DateCourService,
    private readonly courService: CourService,
    private readonly horaireService: HoraireService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private seanceUserService : SeanceUserService,
    private readonly dataSource: DataSource
   

    
  ) {}



  async getAllSeances(): Promise<SeanceEntity[]> {
    return this.seanceRepository.find({
      relations: ['horaire', 'cour', 'dateCour', 'cour.lieu'],
    });
  }

  async getAllFuturSeances(): Promise<SeanceEntity[]> {
    return await this.seanceRepository
      .createQueryBuilder('s')
      .leftJoinAndSelect('s.dateCour', 'dc')
      .where('dc.dateCour > :today', { today: new Date() })
      .getMany();
  }

  async findOneById(id: number): Promise<SeanceEntity> {
    return this.seanceRepository.findOne({
      where: { id },
      relations: ['horaire'],
    });
  }

  async findSeanceUserById(id: number): Promise<SeanceEntity[] | undefined> {
    return await this.seanceRepository.find({
      where: { id },
      relations: ['seanceUsers', 'users'],
    });
  }

  // async createSeance(dto: SeanceCreateDTO): Promise<SeanceEntity | null> {
  //   try {
  //     this.logger.debug(`Creating seance with DTO: ${JSON.stringify(dto)}`);

  //     const dateCour = await this.dateCourService.findDateCourById(
  //       dto.idDateCour,
  //     );
  //     this.logger.debug(`DateCour found: ${JSON.stringify(dateCour)}`);
  //     if (!dateCour) {
  //       throw new NotFoundException('Date de cours non trouvée.');
  //     }

  //     const cour = await this.courService.findCourById(dto.idCour);
  //     this.logger.debug(`Cour found: ${JSON.stringify(cour)}`);
  //     if (!cour) {
  //       throw new NotFoundException('Cours non trouvé.');
  //     }

  //     const horaire = await this.horaireService.findHoraireById(dto.idHoraire);
  //     this.logger.debug(`Horaire found: ${JSON.stringify(horaire)}`);
  //     if (!horaire) {
  //       throw new NotFoundException('Horaire non trouvé.');
  //     }

  //     const seance = new SeanceEntity();
  //     seance.cour = cour;
  //     seance.horaire = horaire;
  //     seance.dateCour = dateCour;

  //     const savedSeance = await this.seanceRepository.save(seance);
  //     this.logger.debug(`Seance saved: ${JSON.stringify(savedSeance)}`);

  //     return savedSeance;
  //   } catch (error) {
  //     this.logger.error('Error creating seance:', error);
  //     throw new InternalServerErrorException(
  //       error,
  //       'Une erreur est survenue lors de la création de la séance.',
  //     );
  //   }
  // }

  async findSeanceById(id: number): Promise<SeanceEntity | undefined> {
    return this.seanceRepository.findOne({
      where: { id },
      relations: ['seanceUsers'],
    });
  }



 

  async getByIdSeance(id: number): Promise<SeanceEntity | null> {
    return await this.seanceRepository.findOne({
      where: { id },
      
    });
  }
  
  
  

  async findById(id: number): Promise<SeanceEntity> {
    const seance = await this.seanceRepository.findOne({
      where: { id }, // Utiliser `where` pour spécifier la condition
      relations: ['cour', 'horaire', 'dateCour'], // Spécifier les relations
    });
  
    if (!seance) {
      throw new NotFoundException(`Séance avec l'ID ${id} non trouvée.`);
    }
  
    return seance;
  }
  


  async saveSeance(seance: SeanceEntity): Promise<SeanceEntity> {
    return this.seanceRepository.save(seance);
  }

  

  async insertParticipantAction(
    id: number,
    userIds: number[],
  ): Promise<SeanceEntity> {
    const seance = await this.findSeanceById(id);
    if (!seance) {
      throw new NotFoundException('Séance non trouvée');
    }

    const users = await this.userRepository.find({
      where: { id: In(userIds) },
    });
    if (!users.length) {
      throw new NotFoundException('Utilisateurs non trouvés');
    }

    if (!seance.users) {
      seance.users = [];
    }
    seance.users.push(...users);

    return this.saveSeance(seance);
  }
  // async createSeanceWithUsers(
  //   dto: SeanceCreateDTO,
  //   userIds: number[],
  // ): Promise<SeanceEntity> {
  //   try {
  //     this.logger.debug(`Creating seance with DTO: ${JSON.stringify(dto)}`);

  //     // 1. Vérification et récupération des entités associées (DateCour, Cour, Horaire)
  //     const dateCour = await this.dateCourService.findDateCourById(
  //       dto.idDateCour,
  //     );
  //     if (!dateCour) {
  //       throw new NotFoundException('Date de cours non trouvée.');
  //     }

  //     const cour = await this.courService.findCourById(dto.idCour);
  //     if (!cour) {
  //       throw new NotFoundException('Cours non trouvé.');
  //     }

  //     const horaire = await this.horaireService.findHoraireById(dto.idHoraire);
  //     if (!horaire) {
  //       throw new NotFoundException('Horaire non trouvé.');
  //     }

  //     // 2. Création de la séance
  //     const seance = new SeanceEntity();
  //     seance.cour = cour;
  //     seance.horaire = horaire;
  //     seance.dateCour = dateCour;

  //     // Sauvegarde de la séance
  //     const savedSeance = await this.seanceRepository.save(seance);

  //     // 3. Vérification que 'userIds' est un tableau avant d'itérer dessus
  //     if (!Array.isArray(userIds) || userIds.length === 0) {
  //       throw new BadRequestException('userIds doit être un tableau non vide');
  //     }

  //     // 4. Récupération des utilisateurs actifs en fonction des IDs fournis
  //     const users = await this.userRepository.findBy({
  //       id: In(userIds),
  //       actif: true,
  //     });
  //     if (users.length === 0) {
  //       throw new NotFoundException(
  //         'Aucun utilisateur actif trouvé avec les IDs fournis',
  //       );
  //     }

  //     // 5. Créer les enregistrements dans SeanceUserEntity pour chaque utilisateur
  //     const seanceUsers: SeanceUserEntity[] = [];

  //     for (const user of users) {
  //       const existingSeanceUser = await this.seanceUserRepository.findOne({
  //         where: { seanceId: savedSeance.id, userId: user.id },
  //       });

  //       if (existingSeanceUser) {
  //         throw new Error(
  //           `L'utilisateur avec l'ID ${user.id} participe déjà à la séance`,
  //         );
  //       }

  //       const seanceUser = this.seanceUserRepository.create({
  //         seanceId: savedSeance.id,
  //         userId: user.id,
  //         presence: false, // par défaut
  //       });

  //       seanceUsers.push(seanceUser);
  //     }

  //     // 6. Sauvegarde dans seance_user
  //     await this.seanceUserRepository.save(seanceUsers);

  //     // 7. Mise à jour de la relation Many-to-Many entre Seance et Users
  //     savedSeance.users = users;
  //     await this.seanceRepository.save(savedSeance);

  //     this.logger.debug(
  //       `Seance created with users: ${JSON.stringify(savedSeance)}`,
  //     );

  //     return savedSeance;
  //   } catch (error) {
  //     this.logger.error('Error creating seance with users:', error);
  //     throw new InternalServerErrorException(
  //       error,
  //       'Une erreur est survenue lors de la création de la séance avec les utilisateurs.',
  //     );
  //   }
  // }

  // async createSeanceWithUsers(dto: SeanceCreateDTO): Promise<SeanceEntity | null> {
  //   try {
  //     this.logger.debug(`Creating seance with DTO: ${JSON.stringify(dto)}`);

  //     // Récupérer la date de cours
  //     const dateCour = await this.dateCourService.findDateCourById(dto.idDateCour);
  //     if (!dateCour) {
  //       throw new NotFoundException('Date de cours non trouvée.');
  //     }

  //     // Récupérer le cours
  //     const cour = await this.courService.findCourById(dto.idCour);
  //     if (!cour) {
  //       throw new NotFoundException('Cours non trouvé.');
  //     }

  //     // Récupérer l'horaire
  //     const horaire = await this.horaireService.findHoraireById(dto.idHoraire);
  //     if (!horaire) {
  //       throw new NotFoundException('Horaire non trouvé.');
  //     }

  //     // Récupérer uniquement les utilisateurs actifs et les informations pertinentes
  //     const activeUsers = await this.userRepository.find({
  //       where: { actif: true },
  //       select: ['first_name', 'last_name', 'email', 'gender', 'level'], // Sélectionner uniquement les colonnes pertinentes
  //       relations: ['level'] // Inclure la relation de niveau/grade
  //     });

  //     this.logger.debug(`Active users found: ${JSON.stringify(activeUsers)}`);

  //     // Créer une nouvelle séance
  //     const seance = new SeanceEntity();
  //     seance.cour = cour;
  //     seance.horaire = horaire;
  //     seance.dateCour = dateCour;

  //     // Associer les utilisateurs actifs à la séance
  //     seance.users = activeUsers;

  //     // Sauvegarder la nouvelle séance avec les utilisateurs actifs associés
  //     const savedSeance = await this.seanceRepository.save(seance);
  //     this.logger.debug(`Seance saved: ${JSON.stringify(savedSeance)}`);

  //     // Retourner la séance sauvegardée, avec uniquement les informations pertinentes des utilisateurs
  //     const userInfos: UserInfoDTO[] = activeUsers.map(user => ({
  //       first_name: user.first_name,
  //       last_name: user.last_name,
  //       email: user.email,
  //       gender: user.gender,
  //       level: user.level ? user.level.grade : 'N/A' // Si "level" existe, afficher son nom, sinon "N/A"
  //     }));

  //     this.logger.debug(`User Infos: ${JSON.stringify(userInfos)}`);

  //     return savedSeance;

  //   } catch (error) {
  //     this.logger.error('Error creating seance:', error.message);
  //     throw new InternalServerErrorException(
  //       error.message,
  //       'Une erreur est survenue lors de la création de la séance.'
  //     );
  //   }
  // }
  // **Méthode pour supprimer une séance**
  // async removeSeance(id: number): Promise<void> {
  //   const seance = await this.seanceRepository.findOne({ where: { id } });
  //   if (!seance) {
  //     throw new NotFoundException(`Seance with ID ${id} not found`);
  //   }
  //   await this.seanceRepository.remove(seance);
  // }
  // async generateSeance(dto: SeanceCreateDTO): Promise<SeanceEntity | null> {
  //   try {
  //     this.logger.debug(`Creating seance with DTO: ${JSON.stringify(dto)}`);
  
  //     // Récupérer la Date de cours
  //     const dateCour = await this.dateCourService.findDateCourById(dto.idDateCour);
  //     this.logger.debug(`DateCour found: ${JSON.stringify(dateCour)}`);
  //     if (!dateCour) {
  //       throw new NotFoundException('Date de cours non trouvée.');
  //     }
  
  //     // Récupérer le Cours
  //     const cour = await this.courService.findCourById(dto.idCour);
  //     this.logger.debug(`Cour found: ${JSON.stringify(cour)}`);
  //     if (!cour) {
  //       throw new NotFoundException('Cours non trouvé.');
  //     }
  
  //     // Récupérer l'Horaire
  //     const horaire = await this.horaireService.findHoraireById(dto.idHoraire);
  //     this.logger.debug(`Horaire found: ${JSON.stringify(horaire)}`);
  //     if (!horaire) {
  //       throw new NotFoundException('Horaire non trouvé.');
  //     }
  
  //     // Récupérer les utilisateurs actifs (avec actif = true)
  //     const activeUsers = await this.userRepository.find({
  //       where: { actif: true }, // Correction: Utilisation de true pour les utilisateurs actifs
  //     });
  //     this.logger.debug(`Active users found: ${JSON.stringify(activeUsers)}`);
  
  //     if (activeUsers.length === 0) {
  //       throw new NotFoundException('Aucun utilisateur actif trouvé.');
  //     }
  
  //     // Créer la nouvelle séance
  //     const seance = new SeanceEntity();
  //     seance.cour = cour;
  //     seance.horaire = horaire;
  //     seance.dateCour = dateCour;
  //     seance.users = activeUsers; // Associer les utilisateurs actifs
  
  //     // Sauvegarder la séance avec les utilisateurs actifs
  //     const savedSeance = await this.seanceRepository.save(seance);
  //     this.logger.debug(`Seance saved: ${JSON.stringify(savedSeance)}`);
  
  //     return savedSeance;
  //   } catch (error) {
  //     this.logger.error('Error creating seance:', error);
  //     throw new InternalServerErrorException(
  //       error,
  //       'Une erreur est survenue lors de la création de la séance.',
  //     );
  //   }
  // }

  // async generateSeance(idDateCour: number, idCour: number, idHoraire: number): Promise<SeanceEntity | null> {
  //   const queryRunner = this.dataSource.createQueryRunner(); // Utilisation de dataSource pour créer un QueryRunner
  //   await queryRunner.startTransaction();

  //   try {
  //     this.logger.debug(`Creating seance with dateCourId: ${idDateCour}, courId: ${idCour}, horaireId: ${idHoraire}`);

  //     // Récupérer la Date de cours
  //     const dateCour = await this.dateCourService.findDateCourById(idDateCour);
  //     if (!dateCour) throw new NotFoundException('Date de cours non trouvée.');

  //     // Récupérer le Cours
  //     const cour = await this.courService.findCourById(idCour);
  //     if (!cour) throw new NotFoundException('Cours non trouvé.');

  //     // Récupérer l'Horaire
  //     const horaire = await this.horaireService.findHoraireById(idHoraire);
  //     if (!horaire) throw new NotFoundException('Horaire non trouvé.');

  //     // Récupérer les utilisateurs actifs
  //     const activeUsers = await this.userRepository.find({ where: { actif: true } });
  //     if (activeUsers.length === 0) throw new NotFoundException('Aucun utilisateur actif trouvé.');

  //     // Créer la nouvelle séance
  //     const seance = new SeanceEntity();
  //     seance.cour = cour;
  //     seance.horaire = horaire;
  //     seance.dateCour = dateCour;

  //     // Sauvegarder la séance
  //     const savedSeance = await queryRunner.manager.save(seance);

  //     // Créer des SeanceUserEntity pour chaque utilisateur actif
  //     const seanceUsers = activeUsers.map(user => {
  //       const seanceUser = new SeanceUserEntity();
  //       seanceUser.seance = savedSeance;
  //       seanceUser.user = user;
  //       return seanceUser;
  //     });

  //     // Sauvegarder les relations dans la table SeanceUser
  //     await queryRunner.manager.save(seanceUsers);

  //     await queryRunner.commitTransaction();
  //     return savedSeance;

  //   } catch (error) {
  //     await queryRunner.rollbackTransaction();
  //     this.logger.error('Error creating seance:', error.message);
  //     throw new InternalServerErrorException('Une erreur est survenue lors de la création de la séance.');
  //   } finally {
  //     await queryRunner.release();
  //   }
  // }

  async generateSeance(
    objectifDuCour: string,
    rue: string,
    commune: string,
    ville: string,
    jour: DayOfWeek,
    heureDebut: string,
    heureFin: string,
    date: Date
  ): Promise<SeanceEntity | null> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
  
    try {
      // Comparaison des heures
      const debutDate = new Date(`1970-01-01T${heureDebut}:00`);
      const finDate = new Date(`1970-01-01T${heureFin}:00`);
  
      if (debutDate.getTime() >= finDate.getTime()) {
        throw new BadRequestException("L'heure de début doit être inférieure à l'heure de fin."); // Message d'erreur personnalisé
      }
  
      // Vérification si le lieu existe déjà
      let existingLieu = await queryRunner.manager.findOne(LieuEntity, {
        where: {
          rue: rue,
          commune: commune,
          ville: ville,
        },
      });
  
      // Si le lieu n'existe pas, nous le créons
      if (!existingLieu) {
        existingLieu = new LieuEntity();
        existingLieu.rue = rue;
        existingLieu.commune = commune;
        existingLieu.ville = ville;
        existingLieu = await queryRunner.manager.save(existingLieu);
      }
  
      // Vérification de l'existence d'une séance avec la même date, même lieu, et des horaires qui se chevauchent
      const existingSeance = await queryRunner.manager.findOne(SeanceEntity, {
        where: {
          cour: { lieu: existingLieu },
          dateCour: { dateCour: date },
          horaire: {
            jour: jour,
            heureDebut: LessThanOrEqual(heureFin),
            heureFin: MoreThanOrEqual(heureDebut),
          },
        },
        relations: ['cour.lieu', 'horaire', 'dateCour'],
      });
  
      if (existingSeance) {
        throw new ConflictException('Une séance est déjà planifiée à la même date, même heure et dans ce lieu.');
      }
  
      // Création du cours
      const cour = new CourEntity();
      cour.objectifDuCour = objectifDuCour;
      cour.lieu = existingLieu;
      const savedCour = await queryRunner.manager.save(cour);
  
      // Création de la date du cours
      const dateCour = new DateCourEntity();
      dateCour.dateCour = date;
      const savedDateCour = await queryRunner.manager.save(dateCour);
  
      // Création de l'horaire
      const horaire = new HoraireEntity();
      horaire.jour = jour;
      horaire.heureDebut = heureDebut;
      horaire.heureFin = heureFin;
      const savedHoraire = await queryRunner.manager.save(horaire);
  
      // Récupérer les utilisateurs actifs
      const activeUsers = await this.userRepository.find({ where: { actif: true } });
      if (activeUsers.length === 0) throw new NotFoundException('Aucun utilisateur actif trouvé.');
  
      // Créer la séance et l'associer au cours, à l'horaire, et à la date
      const seance = new SeanceEntity();
      seance.cour = savedCour;
      seance.horaire = savedHoraire;
      seance.dateCour = savedDateCour;
  
      // Sauvegarder la séance
      const savedSeance = await queryRunner.manager.save(seance);
  
      // Créer des SeanceUserEntity pour chaque utilisateur actif
      const seanceUsers = activeUsers.map((user) => {
        const seanceUser = new SeanceUserEntity();
        seanceUser.seance = savedSeance;
        seanceUser.user = user;
        return seanceUser;
      });
  
      // Sauvegarder les relations dans la table SeanceUser
      await queryRunner.manager.save(seanceUsers);
  
      // Committer la transaction
      await queryRunner.commitTransaction();
      return savedSeance;
  
    } catch (error) {
      // En cas d'erreur, rollback de la transaction
      await queryRunner.rollbackTransaction();
  
      if (error instanceof BadRequestException || error instanceof ConflictException) {
        throw error; // Relancer les erreurs connues
      } else {
        throw new InternalServerErrorException('Une erreur est survenue lors de la création de la séance.');
      }
    } finally {
      // Libérer le QueryRunner pour éviter les fuites
      await queryRunner.release();
    }
  }


  async updateSeance(
    id: number,
    updateSeanceDto: UpdateSeanceDto
): Promise<SeanceEntity> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
        // Récupérer la séance à mettre à jour
        const seance = await queryRunner.manager.findOne(SeanceEntity, {
            where: { id },
            relations: ['cour', 'horaire', 'dateCour', 'cour.lieu']
        });

        if (!seance) {
            throw new NotFoundException('Séance non trouvée');
        }

        // Mise à jour de l'objectif du cours
        seance.cour.objectifDuCour = updateSeanceDto.objectifDuCour;

        // Mise à jour du lieu si nécessaire
        const { rue, commune, ville, jour, heureDebut, heureFin, date } = updateSeanceDto;
        let lieu = seance.cour.lieu;

        // Vérification si le lieu existe déjà
        if (lieu.rue !== rue || lieu.commune !== commune || lieu.ville !== ville) {
            let existingLieu = await queryRunner.manager.findOne(LieuEntity, {
                where: { rue, commune, ville },
            });

            if (!existingLieu) {
                lieu.rue = rue;
                lieu.commune = commune;
                lieu.ville = ville;
                lieu = await queryRunner.manager.save(lieu);
            } else {
                lieu = existingLieu;
            }
        }

        // Vérification d'un conflit d'horaire
        const existingSeance = await queryRunner.manager.findOne(SeanceEntity, {
            where: {
                cour: { lieu },
                dateCour: { dateCour: date },
                horaire: {
                    jour: jour,
                    heureDebut: LessThanOrEqual(heureFin),
                    heureFin: MoreThanOrEqual(heureDebut),
                },
            },
        });

        if (existingSeance && existingSeance.id !== seance.id) {
            throw new ConflictException('Une séance est déjà planifiée à la même date, même heure et dans ce lieu.');
        }

        // Mise à jour des autres champs
        seance.horaire.jour = jour;
        seance.horaire.heureDebut = heureDebut;
        seance.horaire.heureFin = heureFin;
        seance.dateCour.dateCour = date;

        // Sauvegarder les changements
        await queryRunner.manager.save(seance);
        await queryRunner.commitTransaction();

        return seance;
    } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
    } finally {
        await queryRunner.release();
    }
}

  
  
  
  

  async removeSeance(id: number): Promise<void> {
    const seance = await this.seanceRepository.findOne({ where: { id } });
    if (!seance) {
      throw new NotFoundException(`Séance avec l'ID ${id} non trouvée`);
    }
    await this.seanceRepository.remove(seance);
  }
  
    
}
