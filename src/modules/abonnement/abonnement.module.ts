import { Module } from '@nestjs/common';
import { AbonnementService } from './abonnement.service';
import { AbonnementController } from './abonnement.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AbonnementEntity } from './entity/abonnement.entity';

@Module({
  imports:[TypeOrmModule.forFeature([AbonnementEntity])],
  providers: [AbonnementService],
  controllers: [AbonnementController],
  exports:[AbonnementService]
})
export class AbonnementModule {}
