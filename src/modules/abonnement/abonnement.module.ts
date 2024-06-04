import { Module } from '@nestjs/common';
import { AbonnementService } from './abonnement.service';
import { AbonnementController } from './abonnement.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AbonnementEntity } from './entity/abonnement.entity';
import { TypeAbonnementEntity } from '../type-abonnement/entity/type-abonnement';
import { UserEntity } from '../user/entity/user.entity';

@Module({
  imports:[TypeOrmModule.forFeature([AbonnementEntity,TypeAbonnementEntity,UserEntity])],
  providers: [AbonnementService],
  controllers: [AbonnementController],
  exports:[AbonnementService]
})
export class AbonnementModule {}
