
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ProgramService } from './program.service';
import { ProgramController } from './program.controller';
import { ProgramEntity } from './entity/program.entity';
import { LevelService } from '../level/level.service';
import { LevelEntity } from '../level/entity/level.entity';
import { TechnichalTypeEntity } from '../technical-type/entity/technical-type.entity';
import { InitialDataService } from 'src/common/scripts/initialData';
import { TechnicalTypeService } from '../technical-type/technical-type.service';

@Module({
  imports:[TypeOrmModule.forFeature([ProgramEntity,TechnichalTypeEntity])],
  providers: [ProgramService,TechnicalTypeService],
  controllers: [ProgramController],
  exports:[ProgramService]
})
export class ProgramModule {}
