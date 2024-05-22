import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ProgramService } from './program.service';
import { ProgramController } from './program.controller';
import { ProgramEntity } from './entity/program.entity';

@Module({
  imports:[TypeOrmModule.forFeature([ProgramEntity])],
  providers: [ProgramService],
  controllers: [ProgramController]
})
export class ProgramModule {}
