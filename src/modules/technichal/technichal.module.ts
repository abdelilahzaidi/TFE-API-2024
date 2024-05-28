import { Module } from '@nestjs/common';
import { TechnichalService } from './technichal.service';
import { TechnichalController } from './technichal.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TechnichalEntity } from './entity/technichal.entity';
import { InitialDataService } from 'src/common/scripts/initialData';
import { ProgramEntity } from '../program/entity/program.entity';
import { LevelEntity } from '../level/entity/level.entity';
import { TechnichalTypeEntity } from '../technical-type/entity/technical-type.entity';

@Module({
  imports:[TypeOrmModule.forFeature([TechnichalEntity,ProgramEntity,LevelEntity, TechnichalTypeEntity])],
  providers: [TechnichalService,InitialDataService],
  controllers: [TechnichalController],
  exports:[TechnichalService]
})
export class TechnichalModule {}
