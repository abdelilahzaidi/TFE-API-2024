import { Module } from '@nestjs/common';
import { TechnicalTypeController } from './technical-type.controller';
import { TechnicalTypeService } from './technical-type.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TechnichalTypeEntity } from './entity/technical-type.entity';
import { ProgramEntity } from '../program/entity/program.entity';
import { TechnichalEntity } from '../technichal/entity/technichal.entity';
import { EventEntity } from '../event/entity/event.entity';
import { EventService } from '../event/event.service';
import { ProgramService } from '../program/program.service';
import { TechnichalService } from '../technichal/technichal.service';


@Module({
  imports: [TypeOrmModule.forFeature([TechnichalTypeEntity,EventEntity,ProgramEntity,TechnichalEntity])],
  controllers: [TechnicalTypeController],
  providers: [TechnicalTypeService,ProgramService,TechnichalService],
  exports: [TechnicalTypeService], // Exportez TypeOrmModule
})
export class TechnicalTypeModule {}
