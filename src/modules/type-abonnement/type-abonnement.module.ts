import { ProgramEntity } from 'src/modules/program/entity/program.entity';
import { Module } from '@nestjs/common';
import { TypeAbonnementController } from './type-abonnement.controller';
import { TypeAbonnementService } from './type-abonnement.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import { InitialDataService } from 'src/common/scripts/initialData';
import { LevelEntity } from '../level/entity/level.entity';
import { LevelService } from '../level/level.service';
import { TypeAbonnementEntity } from './entity/type-abonnement';
import { TechnichalEntity } from '../technichal/entity/technichal.entity';
import { TechnichalTypeEntity } from '../technical-type/entity/technical-type.entity';
import { ProgramService } from '../program/program.service';
import { TechnicalTypeService } from '../technical-type/technical-type.service';
import { TechnichalService } from '../technichal/technichal.service';

@Module({
  imports:[TypeOrmModule.forFeature([TypeAbonnementEntity,LevelEntity,ProgramEntity,TechnichalEntity,TechnichalTypeEntity])],
  controllers: [TypeAbonnementController],
  providers: [TypeAbonnementService,InitialDataService,LevelService,ProgramService,TechnicalTypeService,TechnichalService],
  exports:[TypeAbonnementService]
})
export class TypeAbonnementModule {}
