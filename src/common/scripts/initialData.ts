import { TarifEnum } from './../enums/tarif.enum';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LevelEntity } from 'src/modules/level/entity/level.entity';
import { Repository } from 'typeorm';
import { LevelEnum } from '../enums/grade.enum';
import { ProgramEntity } from 'src/modules/program/entity/program.entity';
import { ProgramEnum } from '../enums/program.enum';
import { TechnichalTypeEntity } from 'src/modules/technical-type/entity/technical-type.entity';
import { TecnhicTypeEnum } from '../enums/technical-type.enum';
import { TechnichalEntity } from 'src/modules/technichal/entity/technichal.entity';
import { TechnichalEnum } from '../enums/tecnichal.enum';
import { TypeAbonnementEnum } from '../enums/abonnement.enum';
import { TypeAbonnementEntity } from 'src/modules/type-abonnement/entity/type-abonnement';
import { TypeEventEntity } from 'src/modules/type-event/entity/type-event.entity';
import { TypeEventEnum } from '../enums/type-event.enum';

@Injectable()
export class InitialDataService implements OnModuleInit {
  constructor(
    @InjectRepository(LevelEntity)
    private readonly levelRepository: Repository<LevelEntity>,
    @InjectRepository(ProgramEntity)
    private readonly programRepository: Repository<ProgramEntity>,
    @InjectRepository(TechnichalTypeEntity)
    private readonly technicalTypeRepository: Repository<TechnichalTypeEntity>,
    @InjectRepository(TechnichalEntity) 
    private readonly technichalRepository : Repository<TechnichalEntity>,
    @InjectRepository(TypeAbonnementEntity) 
    private readonly typeAbonnemntRepository : Repository<TypeAbonnementEntity>,
    @InjectRepository(TypeEventEntity)
    private readonly typeEventRepository : Repository<TypeEventEntity>
  ) {}

  async onModuleInit() {
    console.log('Initializing data...');

    const levelCount = await this.levelRepository.count();
    const programCount = await this.programRepository.count();
    const technichalTypeCount = await this.technicalTypeRepository.count();
    const technichalCount = await this.technichalRepository.count();
    const typeAbonnementCount = await this.typeAbonnemntRepository.count();
    const typeEventCount = await this.typeEventRepository.count();

    console.log(`Level count: ${levelCount}`);
    console.log(`Program count: ${programCount}`);
    console.log(`TechnichalType count: ${technichalTypeCount}`);
    console.log(`Technichal count: ${technichalCount}`);
    console.log(`Type Event count: ${typeEventCount}`);

    if (levelCount === 0) {
      await this.levelRepository.save([
        { grade: LevelEnum.BLEU_0, during: '6 mois' },
        { grade: LevelEnum.BLEU_1, during: '6 mois' },
        { grade: LevelEnum.BLEU_2, during: '6 mois' },
        { grade: LevelEnum.BLEU_3, during: '12 mois' },
        { grade: LevelEnum.JAUNE_1, during: '6 mois' },
        { grade: LevelEnum.JAUNE_2, during: '6 mois' },
        { grade: LevelEnum.JAUNE_3, during: '6 mois' },
        { grade: LevelEnum.ROUGE_0, during: '6 mois' },
        { grade: LevelEnum.ROUGE_1, during: '6 mois' },
        { grade: LevelEnum.ROUGE_2, during: '6 mois' },
        { grade: LevelEnum.ROUGE_3, during: '6 mois' },
        { grade: LevelEnum.ROUGE_4, during: '6 mois' },
        { grade: LevelEnum.ROUGE_5, during: '6 mois' },
        { grade: LevelEnum.ROUGE_6, during: '6 mois' },
      ]);
      console.log('Level data initialized.');
    }

    if (programCount === 0) {
      await this.programRepository.save([
        { title: ProgramEnum.BLEU_0 },
        { title: ProgramEnum.BLEU_1 },
        { title: ProgramEnum.BLEU_2 },
        { title: ProgramEnum.BLEU_3 },
        { title: ProgramEnum.JAUNE_1 },
        { title: ProgramEnum.JAUNE_2 },
        { title: ProgramEnum.JAUNE_3 },
        { title: ProgramEnum.ROUGE_0 },
        { title: ProgramEnum.ROUGE_1 },
        { title: ProgramEnum.ROUGE_2 },
        { title: ProgramEnum.ROUGE_3 },
        { title: ProgramEnum.ROUGE_4 },
        { title: ProgramEnum.ROUGE_5 },
        { title: ProgramEnum.ROUGE_6 },
      ]);
      console.log('Program data initialized.');
    }

    if (technichalTypeCount === 0) {
      await this.technicalTypeRepository.save([
        { type: TecnhicTypeEnum.TECHNIQUE_DE_BASE },
        { type: TecnhicTypeEnum.POSITION },
        { type: TecnhicTypeEnum.TECHNIQUE_CONTRE_ATTAQUE },
        { type: TecnhicTypeEnum.TECHNIQUE_DE_CISEAUX },
        { type: TecnhicTypeEnum.QUYEN },
        { type: TecnhicTypeEnum.CHIEN_LUOC },
        { type: TecnhicTypeEnum.SONG_LUYEN_HAI },
        { type: TecnhicTypeEnum.SONG_LUYEN_MOT },
        { type: TecnhicTypeEnum.SONG_LUYEN_DAO },
        { type: TecnhicTypeEnum.SONG_LUYEN_VAT_HAI },
      ]);
      console.log('TechnichalType data initialized.');
    }

    if (technichalCount === 0) {
      await this.technichalRepository.save([
        {
          nom: TechnichalEnum.Ciseau_1,
          description: 'Techniques de ciseau 1'
        },
        {
          nom: TechnichalEnum.Coup_de_pied_1,
          description: 'Description de POSITION'
        }
      ]);
      console.log('Technichal data initialized.');
    }
    if (typeAbonnementCount === 0) {
      await this.typeAbonnemntRepository.save([
        {
          type:TypeAbonnementEnum.MENSUEL,
          tarif:TarifEnum.MENSUEL
        },       
        {
          type:TypeAbonnementEnum.ANNUEL,
          tarif:TarifEnum.ANNUEL,          
        }
      ]);
      console.log('Technichal data initialized.');
    }
    if (typeEventCount === 0) {
      console.log('Saving TypeEvent data...');
      await this.typeEventRepository.save([
        { type: TypeEventEnum.CHAMPIONNAT },
        { type: TypeEventEnum.EXAM },
        { type: TypeEventEnum.Excursion },
        { type: TypeEventEnum.FETE },
        { type: TypeEventEnum.LUDIQUE },
        { type: TypeEventEnum.REPRISE },
        { type: TypeEventEnum.RUNION },
      ]);
      console.log('TypeEvent data saved successfully.');
    } else {
      console.log('TypeEvent data already exists, skipping initialization.');
    }
  }
}
