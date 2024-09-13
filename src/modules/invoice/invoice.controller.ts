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
  Query,
} from '@nestjs/common';

@Controller('invoice')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  //Liste toutes les facture
  @Get()
  async all(): Promise<any[]> {
    return await this.invoiceService.all();
  }
  //Créer une facture pour un user
  // @Post(':id')
  // async createInvoice(
  //   @Param('id', ParseIntPipe) idAbonnement: number,
  //   @Body('montant', ParseIntPipe) montant: number,
  // ): Promise<InvoiceEntity> {
  //   return this.invoiceService.createInvoice(idAbonnement, montant);
  // }
  @Post(':id')
  async createInvoice(
    @Param('id', ParseIntPipe) idAbonnement: number,
    @Body('montant', ParseIntPipe) montant: number,
  ): Promise<InvoiceEntity> {
    return this.invoiceService.createInvoiceBis(idAbonnement);
  }
  //assigne une facture à un user
  @Post(':invoiceId/assign/:userId')
  async assignInvoiceToUser(
    @Param('invoiceId') invoiceId: number,
    @Param('userId') userId: number,
  ) {
    return await this.invoiceService.assignInvoiceToUser(invoiceId, userId);
  }

  @Get(':userId/user')
  async getInvoicesByUser(@Param('userId') userId: number) {
    try {
      const invoices = await this.invoiceService.getInvoicesByUser(userId);
      console.log('invoice-user : ', invoices, userId);
      return invoices;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }


  @Get('user/:userId')
  async findByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return this.invoiceService.findByUserId(userId);
  }

  @Get(':id')
  async getInvoiceById(@Param('id', ParseIntPipe) id: number): Promise<InvoiceEntity> {
    return this.invoiceService.findById(id);
  }

  // Nouvelle route pour obtenir les factures d'un utilisateur
  @Get('user/:userId')
  async getInvoicesByUserId(@Param('userId') userId: number): Promise<InvoiceEntity[]> {
    return this.invoiceService.getInvoicesByUserId(userId);
  }



  @Post()
  async genererFactures(@Body('type') type: string) {
    // Vérification manuelle de l'enum
    if (!(type in TypeAbonnementEnum)) {
      throw new BadRequestException(`Invalid subscription type: ${type}`);
    }

    // Convertir en TypeAbonnementEnum
    const enumType = TypeAbonnementEnum[type as keyof typeof TypeAbonnementEnum];

    // Appeler le service pour créer les factures
    await this.invoiceService.creerFacturesParTypeAbonnement(enumType);
    return { message: `Factures générées pour le type d'abonnement ${enumType}` };
  }

//   @Post('creer')
//   async creerFacture(
//     @Body('userId', ParseIntPipe) userId: number,
//   @Body('typeAbonnementId', ParseIntPipe) typeAbonnementId: number,
//   @Body('montant') montant: number,
//   ) {
//     // Validation manuelle des paramètres
//     if (!Number.isInteger(userId) || !Number.isInteger(typeAbonnementId) || isNaN(montant)) {
//       throw new BadRequestException('Invalid numeric values');
//     }

//     return this.invoiceService.creerFacture(userId, typeAbonnementId, montant);
//   }
// @Get('factures')
// async getFactures(
//   @Query('userId') userId: number,
//   @Query('typeAbonnementId') typeAbonnementId: number,
//   @Query('dateEnvoie') dateEnvoie: string, // format 'YYYY-MM-DD'
// ) {
//   const date = new Date(dateEnvoie);
//   return this.invoiceService.getFactures(userId, typeAbonnementId, date);
// }

}
