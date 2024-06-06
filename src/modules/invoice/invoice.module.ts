import { InvoiceEntity } from 'src/modules/invoice/entity/invoice.entity';
import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/entity/user.entity';
import { AbonnementEntity } from '../abonnement/entity/abonnement.entity';

@Module({
  imports:[TypeOrmModule.forFeature([InvoiceEntity,UserEntity,AbonnementEntity])],
  providers: [InvoiceService],
  controllers: [InvoiceController],
  exports:[InvoiceService]
})
export class InvoiceModule {}
