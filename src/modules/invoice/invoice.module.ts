import { InvoiceEntity } from 'src/modules/invoice/entity/invoice.entity';
import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/entity/user.entity';
import { AbonnementEntity } from '../abonnement/entity/abonnement.entity';
import { TypeAbonnementEntity } from '../type-abonnement/entity/type-abonnement';
import { TypeAbonnementService } from '../type-abonnement/type-abonnement.service';

@Module({
  imports:[TypeOrmModule.forFeature([InvoiceEntity,UserEntity,AbonnementEntity, TypeAbonnementEntity])],
  providers: [InvoiceService,TypeAbonnementService],
  controllers: [InvoiceController],
  exports:[InvoiceService]
})
export class InvoiceModule {}
