import { Module } from '@nestjs/common';
import { TypeEventService } from './type-event.service';
import { TypeEventController } from './type-event.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeEventEntity } from './entity/type-event.entity';

@Module({
  imports:[TypeOrmModule.forFeature([TypeEventEntity])],
  providers: [TypeEventService],
  controllers: [TypeEventController],
  exports:[TypeEventService]
})
export class TypeEventModule {}
