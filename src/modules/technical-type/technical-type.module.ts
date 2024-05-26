import { Module } from '@nestjs/common';
import { TechnicalTypeController } from './technical-type.controller';
import { TechnicalTypeService } from './technical-type.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TechnichalTypeEntity } from './entity/technical-type.entity';
import { ProgramEntity } from '../program/entity/program.entity';


@Module({
  imports: [TypeOrmModule.forFeature([TechnichalTypeEntity])],
  controllers: [TechnicalTypeController],
  providers: [TechnicalTypeService],
  exports: [TechnicalTypeService, TypeOrmModule], // Exportez TypeOrmModule
})
export class TechnicalTypeModule {}
