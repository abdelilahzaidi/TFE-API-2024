import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserEntity } from './entity/user.entity';
import { LevelEntity } from '../level/entity/level.entity';
import { ProgramEntity } from '../program/entity/program.entity';
import { ProgramModule } from '../program/program.module';
import { LevelService } from '../level/level.service';
import { TechnichalTypeEntity } from '../technical-type/entity/technical-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity,LevelEntity,ProgramEntity,TechnichalTypeEntity]),
  forwardRef(()=>ProgramModule)
  
],

  providers: [UserService,LevelService],
  controllers: [UserController],
  exports:[UserService]
})
export class UserModule {}
