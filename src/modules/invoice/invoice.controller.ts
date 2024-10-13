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
import { UserEntity } from '../user/entity/user.entity';

@Controller('invoice')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  //Liste toutes les facture
  @Get()
  async all(): Promise<any[]> {
    return await this.invoiceService.all();
  }

  @Get(':id')
  async getInvoiceById(@Param('id') invoiceId: number) {
    return await this.invoiceService.getInvoiceById(invoiceId);
  }


  @Get('users')
  async allUsers(): Promise<UserEntity[]> {
    return await this.invoiceService.actifUsers();
  }

  @Get('user/:userId')
async getInvoicesByUserId(@Param('userId') userId: string) {
  return await this.invoiceService.getInvoicesByUserId(Number(userId));
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
    const { abonnementType, dateEnvoie, montant } = createInvoiceDto;
  
    // Conversion de la date si nécessaire
    const convertedDateEnvoie = new Date(dateEnvoie);
  
    try {
      console.log('Données reçues:', createInvoiceDto); // Log des données pour déboguer
      return await this.invoiceService.assignInvoiceToUsersByAbonnementType(
        abonnementType, // Premier argument : abonnementType
        { dateEnvoie: convertedDateEnvoie, montant }, // Deuxième argument : invoiceData
      );
    } catch (error) {
      console.error('Erreur lors de la création des factures:', error.message); // Log des erreurs
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

  @Post('assign')
  async assignInvoices(
    @Body() assignInvoicesDto: { abonnementType: 'Mensuel' | 'Annuel'; dateEnvoie: string; montant: number }
  ): Promise<InvoiceEntity[]> {
    const { abonnementType, dateEnvoie, montant } = assignInvoicesDto;

    if (!abonnementType || !dateEnvoie || montant == null) {
      throw new BadRequestException('Les champs abonnementType, dateEnvoie, et montant sont requis.');
    }

    // Convertir la date de string en Date
    const parsedDate = new Date(dateEnvoie);
    if (isNaN(parsedDate.getTime())) {
      throw new BadRequestException('La dateEnvoie doit être une date valide au format YYYY-MM-DD.');
    }

    return await this.invoiceService.assignInvoiceToUsersByAbonnementType(abonnementType, {
      dateEnvoie: parsedDate,
      montant,
    });
  }



}
