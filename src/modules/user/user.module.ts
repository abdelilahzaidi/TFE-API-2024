import { SeanceModule } from './../seance/seance.module';
import { TechnicalTypeService } from './../technical-type/technical-type.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserEntity } from './entity/user.entity';
import { LevelEntity } from '../level/entity/level.entity';
import { ProgramEntity } from '../program/entity/program.entity';
import { ProgramModule } from '../program/program.module';
import { LevelService } from '../level/level.service';
import { TechnichalTypeEntity } from '../technical-type/entity/technical-type.entity';
import { TechnichalEntity } from '../technichal/entity/technichal.entity';
import { MessageEntity } from '../message/entity/message.entity';
import { MessageService } from '../message/message.service';
import { EventEntity } from '../event/entity/event.entity';
import { EventService } from '../event/event.service';
import { SeanceEntity } from '../seance/entity/seance.entity';
import { SeanceService } from '../seance/seance.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity,LevelEntity,ProgramEntity,TechnichalTypeEntity,TechnichalEntity,MessageEntity,EventEntity,SeanceEntity]),
  forwardRef(()=>ProgramModule),
  forwardRef(()=>SeanceModule)
  
],

  providers: [UserService,LevelService,MessageService,EventService,TechnicalTypeService,SeanceService],
  controllers: [UserController],
  exports:[UserService]
})
export class UserModule {}
