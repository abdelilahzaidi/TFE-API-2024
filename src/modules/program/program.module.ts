import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ProgramService } from './program.service';
import { ProgramController } from './program.controller';
import { ProgramEntity } from './entity/program.entity';
import { LevelService } from '../level/level.service';
import { LevelEntity } from '../level/entity/level.entity';

@Module({
  imports:[TypeOrmModule.forFeature([ProgramEntity])],
  providers: [ProgramService],
  controllers: [ProgramController],
  exports:[ProgramService]
})
export class ProgramModule {}
