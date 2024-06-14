
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ProgramService } from './program.service';
import { ProgramController } from './program.controller';
import { ProgramEntity } from './entity/program.entity';
import { LevelService } from '../level/level.service';
import { LevelEntity } from '../level/entity/level.entity';
import { TechnichalTypeEntity } from '../technical-type/entity/technical-type.entity';
import { InitialDataService } from 'src/common/scripts/initialData';
import { TechnicalTypeService } from '../technical-type/technical-type.service';
import { TechnichalEntity } from '../technichal/entity/technichal.entity';
import { TechnichalService } from '../technichal/technichal.service';
import { EventService } from '../event/event.service';
import { EventEntity } from '../event/entity/event.entity';
import { UserEntity } from '../user/entity/user.entity';
import { UserService } from '../user/user.service';
import { TypeAbonnementService } from '../type-abonnement/type-abonnement.service';
import { TypeAbonnementEntity } from '../type-abonnement/entity/type-abonnement';
import { SeanceUserModule } from '../seance-user/seance-user.module';
import { SeanceUserEntity } from '../seance-user/entity/seance-user.entity';

@Module({
  imports:[TypeOrmModule.forFeature([ProgramEntity,TechnichalTypeEntity,TechnichalEntity,EventEntity,UserEntity,LevelEntity,TypeAbonnementEntity,SeanceUserEntity])],
  providers: [ProgramService,TechnicalTypeService,TechnichalService,EventService,UserService,LevelService,TypeAbonnementService],
  controllers: [ProgramController],
  exports:[ProgramService]
})
export class ProgramModule {}
