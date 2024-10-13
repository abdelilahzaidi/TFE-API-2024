import { EventEntity } from 'src/modules/event/entity/event.entity';
import { Module } from '@nestjs/common';
import { SeanceUserController } from './seance-user.controller';
import { SeanceUserService } from './seance-user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeanceUserEntity } from './entity/seance-user.entity';
import { UserEntity } from '../user/entity/user.entity';
import { SeanceEntity } from '../seance/entity/seance.entity';
import { HoraireEntity } from '../horaire/entity/horaire.entity';
import { DateCourEntity } from '../date-cour/entity/date.entity';
import { HoraireService } from '../horaire/horaire.service';

@Module({
  imports:[TypeOrmModule.forFeature([SeanceUserEntity,EventEntity,UserEntity, SeanceEntity,HoraireEntity,DateCourEntity])],
  controllers: [SeanceUserController],
  providers: [SeanceUserService,HoraireService,],
  exports:[SeanceUserService]
})
export class SeanceUserModule {}
