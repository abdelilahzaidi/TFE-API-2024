import { Module } from '@nestjs/common';
import { SeanceUserController } from './seance-user.controller';
import { SeanceUserService } from './seance-user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeanceUserEntity } from './entity/seance-user.entity';

@Module({
  imports:[TypeOrmModule.forFeature([SeanceUserEntity])],
  controllers: [SeanceUserController],
  providers: [SeanceUserService],
  exports:[SeanceUserService]
})
export class SeanceUserModule {}
