import { LevelEntity } from 'src/modules/level/entity/level.entity';
import { Module, forwardRef } from '@nestjs/common';
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
import { UserModule } from '../user/user.module';
import { LevelModule } from '../level/level.module';
import { SeanceUserEntity } from '../seance-user/entity/seance-user.entity';

@Module({
  imports:[TypeOrmModule.forFeature([HoraireEntity,UserEntity,LevelEntity,SeanceUserEntity]),forwardRef(()=>UserModule),forwardRef(()=>LevelModule)],
  controllers: [HoraireController],
  providers: [HoraireService,UserService],
  exports:[HoraireService]
})
export class HoraireModule {}
