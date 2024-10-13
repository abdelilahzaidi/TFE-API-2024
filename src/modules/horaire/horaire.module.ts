import { MessageEntity } from './../message/entity/message.entity';
import { LevelEntity } from 'src/modules/level/entity/level.entity';
import { Module, forwardRef } from '@nestjs/common';
import { HoraireController } from './horaire.controller';
import { HoraireService } from './horaire.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HoraireEntity } from './entity/horaire.entity';
import { UserEntity } from '../user/entity/user.entity';
import { UserService } from '../user/user.service';
import { UserModule } from '../user/user.module';
import { LevelModule } from '../level/level.module';
import { SeanceUserEntity } from '../seance-user/entity/seance-user.entity';
import { MailService } from '../mail/mail.service';
import { JwtService } from '@nestjs/jwt';
import { SeanceEntity } from '../seance/entity/seance.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      HoraireEntity,
      UserEntity,
      LevelEntity,
      SeanceUserEntity,
      MessageEntity,
      SeanceEntity
    ]),
    forwardRef(() => UserModule),
    forwardRef(() => LevelModule),
  ],
  controllers: [HoraireController],
  providers: [HoraireService, UserService,MailService,JwtService],
  exports: [HoraireService],
})
export class HoraireModule {}
