import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';

import { UserModule } from './modules/user/user.module';
import { BdModule } from './common/BD/bd.module';
import { AuthModule } from './modules/auth/auth.module';
import { LevelModule } from './modules/level/level.module';
import { ProgramModule } from './modules/program/program.module';
import { TechnicalTypeModule } from './modules/technical-type/technical-type.module';
import { TechnichalModule } from './modules/technichal/technichal.module';
import { MessageModule } from './modules/message/message.module';
import { EventModule } from './modules/event/event.module';
import { TypeEventModule } from './modules/type-event/type-event.module';
import { AbonnementModule } from './modules/abonnement/abonnement.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    BdModule,
    AuthModule,
    UserModule,
    LevelModule,
    ProgramModule,
    TechnicalTypeModule,
    TechnichalModule,
    MessageModule,
    EventModule,
    TypeEventModule,
    AbonnementModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
