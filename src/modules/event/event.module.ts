import { MessageEntity } from './../message/entity/message.entity';
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
import { MailService } from '../mail/mail.service';
import { JwtService } from '@nestjs/jwt';
import { MessageService } from '../message/message.service';
import { TechnichalTypeEntity } from '../technical-type/entity/technical-type.entity';

@Module({
  imports:[TypeOrmModule.forFeature([EventEntity,UserEntity,LevelEntity,ProgramEntity,
    TechnichalEntity,TechnichalTypeEntity,SeanceUserEntity, MessageEntity])],
  providers: [EventService,UserService,LevelService,ProgramService,TechnichalService,MailService,JwtService,MessageService],
  controllers: [EventController],
  exports:[EventService]
})
export class EventModule {}
