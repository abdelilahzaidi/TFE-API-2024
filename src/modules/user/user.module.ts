import { HoraireService } from './../horaire/horaire.service';
import { CourModule } from './../cour/cour.module';
import { CourEntity } from './../cour/entity/cour.entity';
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
import { HoraireEntity } from '../horaire/entity/horaire.entity';
import { HoraireModule } from '../horaire/horaire.module';
import { DateCourEntity } from '../date-cour/entity/date.entity';
import { DateCourModule } from '../date-cour/date-cour.module';
import { SeanceUserEntity } from '../seance-user/entity/seance-user.entity';
import { SeanceUserModule } from '../seance-user/seance-user.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity,LevelEntity,ProgramEntity,TechnichalTypeEntity,TechnichalEntity,MessageEntity,EventEntity,SeanceEntity,CourEntity,HoraireEntity,DateCourEntity,SeanceUserEntity]),
  forwardRef(()=>ProgramModule),
  forwardRef(()=>CourModule),
  forwardRef(()=>DateCourModule),
  forwardRef(()=>HoraireModule),
  forwardRef(()=>SeanceModule), forwardRef(()=>SeanceUserModule)
  
],

  providers: [UserService,LevelService,MessageService,EventService,TechnicalTypeService,SeanceService,HoraireService],
  controllers: [UserController],
  exports:[UserService]
})
export class UserModule {}
