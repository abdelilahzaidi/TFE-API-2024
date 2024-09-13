import { InvoiceModule } from './modules/invoice/invoice.module';
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
import { TypeAbonnementModule } from './modules/type-abonnement/type-abonnement.module';
import { SeanceModule } from './modules/seance/seance.module';
import { DateCourModule } from './modules/date-cour/date-cour.module';
import { CourModule } from './modules/cour/cour.module';
import { LieuModule } from './modules/lieu/lieu.module';
import { HoraireModule } from './modules/horaire/horaire.module';
import { SeanceUserModule } from './modules/seance-user/seance-user.module';
import { MailerModule } from '@nestjs-modules/mailer';

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
    AbonnementModule,
    TypeAbonnementModule,
    InvoiceModule,
    SeanceModule,
    DateCourModule,
    CourModule,
    LieuModule,
    HoraireModule,
    SeanceUserModule,
    MailerModule.forRoot({
      transport: {
        host: process.env.EMAIL_HOST,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASSWORD,
        },
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
