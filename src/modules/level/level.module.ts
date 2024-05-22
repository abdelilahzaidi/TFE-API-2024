import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { LevelController } from './level.controller';
import { LevelService } from './level.service';
import { LevelEntity } from './entity/level.entity';
import { InitialDataService } from 'src/common/scripts/initialData';
import { ProgramEntity } from '../program/entity/program.entity';


@Module({
  imports:[TypeOrmModule.forFeature([LevelEntity,ProgramEntity])],
  controllers: [LevelController],
  providers: [LevelService,InitialDataService],
  exports:[LevelService]
})
export class LevelModule {}
