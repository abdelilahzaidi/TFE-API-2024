import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [
    ConfigModule.forRoot({ // Assurez-vous que ConfigModule est correctement configuré
      isGlobal: true, // Optionnel : Permet de rendre le ConfigModule global
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'), // Utilisation de ConfigService pour obtenir l'hôte
        port: configService.get<number>('DB_PORT', 5432), // Utilisation de ConfigService pour obtenir le port
        username: configService.get<string>("DB_USERNAME"),
        password: configService.get<string>("DB_PASSWORD"),
        database: configService.get<string>("DB_NAME"),
        entities: [], // Assurez-vous que le chemin est correct
        autoLoadEntities: true, // Charge automatiquement les entités
        synchronize: true, // Mettez à true pour le développement si nécessaire
       
      }),
      inject: [ConfigService],
    }),
  ],
  
})
export class BdModule { }
