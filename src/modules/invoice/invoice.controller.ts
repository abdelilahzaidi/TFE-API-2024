import { TypeAbonnementEnum } from 'src/common/enums/abonnement.enum';
import { InvoiceEntity } from './entity/invoice.entity';
import { InvoiceService } from './invoice.service';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';

@Controller('invoice')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  //Liste toutes les facture
  @Get()
  async all(): Promise<any[]> {
    return await this.invoiceService.all();
  }

  @Post('assign-to-user')
  async assignInvoice(
    @Body() assignInvoiceDto: { userId: number; abonnementId: number; dateEnvoie: Date; montant: number }
  ) {
    return await this.invoiceService.assignInvoiceToUser(
      assignInvoiceDto.userId,
      assignInvoiceDto.abonnementId,
      { dateEnvoie: assignInvoiceDto.dateEnvoie, montant: assignInvoiceDto.montant }
    );
  }




  @Post('/assign-by-abonnement-type')
  async assignInvoiceToUsers(
    @Body() createInvoiceDto: CreateInvoiceDto,
  ): Promise<InvoiceEntity[]> {
    const { userIds, abonnementType, dateEnvoie, montant } = createInvoiceDto;

    
    const convertedDateEnvoie = new Date(dateEnvoie);

    try {
      
      return await this.invoiceService.assignInvoiceToUsersByAbonnementType(
        userIds,
        abonnementType,
        { dateEnvoie: convertedDateEnvoie, montant },
      );
    } catch (error) {
      throw new BadRequestException(
        `Erreur lors de la création des factures : ${error.message}`,
      );
    }
  }

  @Put(':id/payment-status')
  async updatePaymentStatus(
    @Param('id') invoiceId: number,
    @Body('etatDePaiement') etatDePaiement: boolean,
  ) {
    return await this.invoiceService.updatePaymentStatus(invoiceId, etatDePaiement);
  }



}
