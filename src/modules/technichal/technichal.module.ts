import { Module } from '@nestjs/common';
import { TechnichalService } from './technichal.service';
import { TechnichalController } from './technichal.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TechnichalEntity } from './entity/technichal.entity';
import { InitialDataService } from 'src/common/scripts/initialData';
import { ProgramEntity } from '../program/entity/program.entity';
import { LevelEntity } from '../level/entity/level.entity';
import { TechnichalTypeEntity } from '../technical-type/entity/technical-type.entity';
import { TechnicalTypeService } from '../technical-type/technical-type.service';
import { TypeAbonnementEntity } from '../type-abonnement/entity/type-abonnement';
import { ProgramService } from '../program/program.service';
import { TypeEventEntity } from '../type-event/entity/type-event.entity';
import { TypeEventService } from '../type-event/type-event.service';

@Module({
  imports:[TypeOrmModule.forFeature([TechnichalEntity,ProgramEntity,LevelEntity, TechnichalTypeEntity,TypeAbonnementEntity,TechnichalEntity,TypeEventEntity])],
  providers: [TechnichalService,InitialDataService,TechnicalTypeService,ProgramService,TechnichalService,TypeEventService],
  controllers: [TechnichalController],
  exports:[TechnichalService]
})
export class TechnichalModule {}
