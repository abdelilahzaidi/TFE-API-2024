import { Module } from '@nestjs/common';
import { HoraireController } from './horaire.controller';
import { HoraireService } from './horaire.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HoraireEntity } from './entity/horaire.entity';
import { SeanceService } from '../seance/seance.service';
import { UserEntity } from '../user/entity/user.entity';
import { SeanceEntity } from '../seance/entity/seance.entity';
import { UserService } from '../user/user.service';
import { DateCourEntity } from '../date-cour/entity/date.entity';
import { DateCourService } from '../date-cour/date-cour.service';

@Module({
  imports:[TypeOrmModule.forFeature([HoraireEntity])],
  controllers: [HoraireController],
  providers: [HoraireService],
  exports:[HoraireService]
})
export class HoraireModule {}
