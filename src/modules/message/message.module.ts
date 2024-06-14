import { TechnicalTypeService } from './../technical-type/technical-type.service';
import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageEntity } from './entity/message.entity';
import { UserService } from '../user/user.service';
import { UserEntity } from '../user/entity/user.entity';
import { LevelService } from '../level/level.service';
import { LevelEntity } from '../level/entity/level.entity';
import { ProgramEntity } from '../program/entity/program.entity';
import { ProgramService } from '../program/program.service';
import { TechnichalEntity } from '../technichal/entity/technichal.entity';
import { TechnichalService } from '../technichal/technichal.service';
import { TechnichalTypeEntity } from '../technical-type/entity/technical-type.entity';
import { SeanceUserModule } from '../seance-user/seance-user.module';
import { SeanceUserEntity } from '../seance-user/entity/seance-user.entity';

@Module({
  imports:[TypeOrmModule.forFeature([MessageEntity,UserEntity,LevelEntity,ProgramEntity,TechnichalEntity,TechnichalTypeEntity,SeanceUserEntity])],
  providers: [MessageService,UserService,LevelService,ProgramService,TechnichalService,TechnicalTypeService],
  controllers: [MessageController],
  exports:[MessageService]
})
export class MessageModule {}
