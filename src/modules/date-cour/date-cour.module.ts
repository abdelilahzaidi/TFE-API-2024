import { Module, forwardRef } from '@nestjs/common';
import { DateCourService } from './date-cour.service';
import { DateCourController } from './date-cour.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DateCourEntity } from './entity/date.entity';
import { SeanceEntity } from '../seance/entity/seance.entity';
import { SeanceService } from '../seance/seance.service';
import { CourModule } from '../cour/cour.module';
import { CourService } from '../cour/cour.service';
import { HoraireEntity } from '../horaire/entity/horaire.entity';
import { HoraireService } from '../horaire/horaire.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([DateCourEntity]),
    
  ],
  providers: [DateCourService],
  controllers: [DateCourController],
  exports: [DateCourService],
})
export class DateCourModule {}
