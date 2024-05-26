import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LevelEntity } from 'src/modules/level/entity/level.entity';
import { Repository } from 'typeorm';
import { LevelEnum } from '../enums/grade.enum';
import { ProgramEntity } from 'src/modules/program/entity/program.entity';
import { ProgramEnum } from '../enums/program.enum';

@Injectable()
export class InitialDataService implements OnModuleInit {
  constructor(
    @InjectRepository(LevelEntity)
    private readonly levelRepository: Repository<LevelEntity>,
    @InjectRepository(ProgramEntity)
    private readonly programRepository : Repository<ProgramEntity>
  ) {}
  async onModuleInit() {
    const levelCount = await this.levelRepository.count();
    const programCount =await this.programRepository.count();
    if (levelCount === 0) {
      await this.levelRepository.save([
        { grade: LevelEnum.BLEU_0, during :"6 mois" },
        { grade: LevelEnum.BLEU_1, during :"6 mois" },
        { grade: LevelEnum.BLEU_2, during :"6 mois" },
        { grade: LevelEnum.BLEU_3, during :"6 mois" },
        { grade: LevelEnum.JAUNE_1, during :"6 mois" },
        { grade: LevelEnum.JAUNE_2, during :"6 mois" },
        { grade: LevelEnum.JAUNE_3, during :"6 mois" },
        { grade: LevelEnum.ROUGE_0, during :"6 mois" },
        { grade: LevelEnum.ROUGE_1, during :"6 mois" },
        { grade: LevelEnum.ROUGE_2, during :"6 mois" },
        { grade: LevelEnum.ROUGE_3, during :"6 mois" },
        { grade: LevelEnum.ROUGE_4, during :"6 mois" },
        { grade: LevelEnum.ROUGE_5, during :"6 mois" },
        { grade: LevelEnum.ROUGE_6, during :"6 mois" },
      ]);
    }
    if(programCount === 0){
      await this.programRepository.save([
        {title : ProgramEnum.BLEU_0},
        {title : ProgramEnum.BLEU_1},
        {title : ProgramEnum.BLEU_2},
        {title : ProgramEnum.BLEU_3},
        {title : ProgramEnum.JAUNE_1},
        {title : ProgramEnum.JAUNE_2},
        {title : ProgramEnum.JAUNE_3},
        {title : ProgramEnum.ROUGE_0},
        {title : ProgramEnum.ROUGE_1},
        {title : ProgramEnum.ROUGE_2},
        {title : ProgramEnum.ROUGE_3},
        {title : ProgramEnum.ROUGE_4},
        {title : ProgramEnum.ROUGE_5},
        {title : ProgramEnum.ROUGE_6}
      ])
    }
  }
}