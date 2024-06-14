import { UserService } from './../user/user.service';
import { EventEntity } from './entity/event.entity';
import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/entity/user.entity';
import { LevelService } from '../level/level.service';
import { LevelEntity } from '../level/entity/level.entity';
import { ProgramService } from '../program/program.service';
import { ProgramEntity } from '../program/entity/program.entity';
import { TechnichalEntity } from '../technichal/entity/technichal.entity';
import { TechnichalService } from '../technichal/technichal.service';
import { TechnicalTypeModule } from '../technical-type/technical-type.module';
import { TechnicalTypeService } from '../technical-type/technical-type.service';
import { SeanceUserEntity } from '../seance-user/entity/seance-user.entity';

@Module({
  imports:[TypeOrmModule.forFeature([EventEntity,UserEntity,LevelEntity,ProgramEntity,
    TechnichalEntity,TechnicalTypeModule,SeanceUserEntity])],
  providers: [EventService,UserService,LevelService,ProgramService,TechnichalService],
  controllers: [EventController],
  exports:[EventService]
})
export class EventModule {}
