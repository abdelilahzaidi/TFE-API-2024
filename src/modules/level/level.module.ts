import { MessageEntity } from 'src/modules/message/entity/message.entity';
import { TechnicalTypeService } from './../technical-type/technical-type.service';
import { TechnichalTypeEntity } from './../technical-type/entity/technical-type.entity';
import { ProgramService } from './../program/program.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, forwardRef } from '@nestjs/common';
import { LevelController } from './level.controller';
import { LevelService } from './level.service';
import { LevelEntity } from './entity/level.entity';
import { InitialDataService } from 'src/common/scripts/initialData';
import { ProgramEntity } from '../program/entity/program.entity';
import { ProgramModule } from '../program/program.module';
import { TechnichalEntity } from '../technichal/entity/technichal.entity';
import { TechnichalService } from '../technichal/technichal.service';
import { MessageService } from '../message/message.service';
import { UserService } from '../user/user.service';
import { UserEntity } from '../user/entity/user.entity';



@Module({
  imports:[TypeOrmModule.forFeature([LevelEntity,ProgramEntity,TechnichalTypeEntity,TechnichalEntity,MessageEntity,UserEntity])],
  controllers: [LevelController],
  providers: [LevelService,InitialDataService,ProgramService,TechnicalTypeService,TechnichalService,MessageService,UserService],
  exports:[LevelService]
})
export class LevelModule {}
