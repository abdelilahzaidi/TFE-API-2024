import { SeanceService } from './../seance/seance.service';
import { LieuService } from './../lieu/lieu.service';
import { Module, forwardRef } from '@nestjs/common';
import { CourService } from './cour.service';
import { CourController } from './cour.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourEntity } from './entity/cour.entity';
import { LieuEntity } from '../lieu/entity/lieu.entity';
import { SeanceEntity } from '../seance/entity/seance.entity';
import { LieuModule } from '../lieu/lieu.module';
import { DateCourModule } from '../date-cour/date-cour.module';
import { DateCourService } from '../date-cour/date-cour.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CourEntity])
   
    
  ],
  providers: [CourService],
  controllers: [CourController],
  exports: [CourService],
})
export class CourModule {}
