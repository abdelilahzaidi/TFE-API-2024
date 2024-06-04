import { Module } from '@nestjs/common';
import { TechnicalTypeController } from './technical-type.controller';
import { TechnicalTypeService } from './technical-type.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TechnichalTypeEntity } from './entity/technical-type.entity';
import { ProgramEntity } from '../program/entity/program.entity';
import { TechnichalEntity } from '../technichal/entity/technichal.entity';
import { EventEntity } from '../event/entity/event.entity';
import { EventService } from '../event/event.service';


@Module({
  imports: [TypeOrmModule.forFeature([TechnichalTypeEntity,EventEntity])],
  controllers: [TechnicalTypeController],
  providers: [TechnicalTypeService],
  exports: [TechnicalTypeService], // Exportez TypeOrmModule
})
export class TechnicalTypeModule {}
