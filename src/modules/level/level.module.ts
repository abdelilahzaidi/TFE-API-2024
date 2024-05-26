import { TechnichalTypeEntity } from './../technical-type/entity/technical-type.entity';
import { ProgramService } from './../program/program.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, forwardRef } from '@nestjs/common';
import { LevelController } from './level.controller';
import { LevelService } from './level.service';
import { LevelEntity } from './entity/level.entity';
import { InitialDataService } from 'src/common/scripts/initialData';
import { ProgramEntity } from '../program/entity/program.entity';
import { ProgramModule } from '../program/program.module';
import { TechnicalTypeService } from '../technical-type/technical-type.service';


@Module({
  imports:[TypeOrmModule.forFeature([LevelEntity,ProgramEntity,TechnichalTypeEntity])],
  controllers: [LevelController],
  providers: [LevelService,InitialDataService,ProgramService],
  exports:[LevelService]
})
export class LevelModule {}
