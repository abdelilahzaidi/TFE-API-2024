import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InvoiceEntity } from './entity/invoice.entity';
import { AbonnementEntity } from '../abonnement/entity/abonnement.entity';
import { UserEntity } from '../user/entity/user.entity';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(InvoiceEntity)
    private readonly invoiceRepository: Repository<InvoiceEntity>,

    @InjectRepository(AbonnementEntity)
    private readonly abonnementRepository: Repository<AbonnementEntity>,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async all(): Promise<any[]> {
    return await this.invoiceRepository.find();
  }

  async createInvoice(userId: number, montant: number): Promise<InvoiceEntity> {
    const user = await this.userRepository.findOne({ where: { id: userId } }); // Find user by userId
    if (!user) {
      throw new Error('User not found');
    }

    const abonnement = await this.abonnementRepository.findOne({
      where: { user }, // Use user entity instead of userId
    });
    if (!abonnement) {
      throw new Error('Abonnement not found for user');
    }

    const invoice = new InvoiceEntity();
    invoice.dateEnvoie = new Date();
    invoice.etatDePaiement = false;
    invoice.montant = montant;
    invoice.abonnement = abonnement;

    return this.invoiceRepository.save(invoice);
  }

  async assignInvoiceToUser(
    invoiceId: number,
    userId: number,
  ): Promise<InvoiceEntity> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }
    const invoice = await this.invoiceRepository.findOne({
      where: { id: invoiceId },
    });
    if (!invoice) {
      throw new Error('Invoice not found');
    }
    const abonnement = await this.abonnementRepository.findOne({
      where: { id: userId },
    });
    console.log('abonnement ', abonnement);
    if (!abonnement) {
      throw new Error('User does not have a subscription');
    }
    invoice.abonnement = abonnement;

    return this.invoiceRepository.save(invoice);
  }

  async getInvoicesByUser(userId: number): Promise<InvoiceEntity[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['abonnements', 'abonnements.invoices'],
    });
    if (!user) {
      throw new Error('User not found');
    }
    console.log('user : ', user);

    const invoices = user.abonnements.reduce((acc, abonnement) => {
      acc.push(...abonnement.invoices);
      return acc;
    }, []);

    if (!invoices || invoices.length === 0) {
      throw new Error('No invoices found for the user');
    }

    return invoices;
  }
}
