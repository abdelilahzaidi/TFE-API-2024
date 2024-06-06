import { DateCourService } from './../date-cour/date-cour.service';
import { HoraireEntity } from './../horaire/entity/horaire.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, forwardRef } from '@nestjs/common';
import { SeanceService } from './seance.service';
import { SeanceController } from './seance.controller';
import { SeanceEntity } from './entity/seance.entity';
import { UserEntity } from '../user/entity/user.entity';
import { CourEntity } from '../cour/entity/cour.entity';
import { DateCourEntity } from '../date-cour/entity/date.entity';
import { UserService } from '../user/user.service';
import { HoraireService } from '../horaire/horaire.service';
import { CourService } from '../cour/cour.service';
import { CourModule } from '../cour/cour.module';
import { DateCourModule } from '../date-cour/date-cour.module';
import { HoraireModule } from '../horaire/horaire.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SeanceEntity]),

  ],
  providers: [SeanceService],
  controllers: [SeanceController],
  exports: [SeanceService],
})
export class SeanceModule {}
