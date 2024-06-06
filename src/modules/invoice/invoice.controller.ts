import { InvoiceService } from './invoice.service';
import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';

@Controller('invoice')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Get()
  async all(): Promise<any[]> {
    return await this.invoiceService.all();
  }

  @Post(':userId/user')
  async createInvoice(
    @Param('userId') userId: number,
    @Body('montant') montant: number,
  ) {
    return this.invoiceService.createInvoice(userId, montant);
  }

  @Post('assign')
  async assignInvoiceToUser(
    @Param('invoiceId') invoiceId: number,
    @Param('userId') userId: number,
  ) {
    try {
      const invoice = await this.invoiceService.assignInvoiceToUser(
        invoiceId,
        userId,
      );
      return { message: 'Invoice assigned successfully', invoice };
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Get(':userId/user')
  async getInvoicesByUser(@Param('userId') userId: number) {
    try {
      const invoices = await this.invoiceService.getInvoicesByUser(userId);
      console.log('invoice-user : ',invoices , userId)
      return invoices;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  
}
