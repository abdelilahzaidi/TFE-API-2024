
import { LieuService } from './../lieu/lieu.service';
import { Module} from '@nestjs/common';
import { CourService } from './cour.service';
import { CourController } from './cour.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourEntity } from './entity/cour.entity';
import { LieuEntity } from '../lieu/entity/lieu.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CourEntity,LieuEntity])
   
    
  ],
  providers: [CourService,LieuService],
  controllers: [CourController],
  exports: [CourService],
})
export class CourModule {}
