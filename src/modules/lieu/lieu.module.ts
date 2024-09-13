import { Module } from '@nestjs/common';
import { LieuService } from './lieu.service';
import { LieuController } from './lieu.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LieuEntity } from './entity/lieu.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LieuEntity])],
  providers: [LieuService],
  controllers: [LieuController],
  exports: [LieuService],
})
export class LieuModule {}
