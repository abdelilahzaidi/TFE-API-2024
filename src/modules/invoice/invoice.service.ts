import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InvoiceEntity } from './entity/invoice.entity';
import { AbonnementEntity } from '../abonnement/entity/abonnement.entity';
import { UserEntity } from '../user/entity/user.entity';
import { log } from 'console';
import { TypeAbonnementService } from '../type-abonnement/type-abonnement.service';
import { TypeAbonnementEnum } from 'src/common/enums/abonnement.enum';
import { TarifEnum } from 'src/common/enums/tarif.enum';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(InvoiceEntity)
    private readonly invoiceRepository: Repository<InvoiceEntity>,

    @InjectRepository(AbonnementEntity)
    private readonly abonnementRepository: Repository<AbonnementEntity>,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly typeAbonnementByUser: TypeAbonnementService,
  ) {}

  async all(): Promise<any[]> {
    
    const invoices = await this.invoiceRepository.find({
      relations: ['abonnement', 'abonnement.typeAbonnement', 'abonnement.user'],
    });
  
    
    invoices.forEach(invoice => {
      if (invoice.abonnement && invoice.abonnement.user) {
        delete invoice.abonnement.user.password;
      }
    });
  
    return invoices;
  }


  // Méthode pour assigner une facture à un utilisateur par abonnement
  async assignInvoiceToUser(
    userId: number,
    abonnementId: number,
    invoiceData: { dateEnvoie: Date; montant: number }
  ): Promise<InvoiceEntity> {
    
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['abonnements'],
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    
    const abonnement = await this.abonnementRepository.findOne({
      where: { id: abonnementId, user: { id: userId } },
      relations: ['user'],
    });

    if (!abonnement) {
      throw new NotFoundException('Abonnement non trouvé pour cet utilisateur');
    }

    // Créer et assigner la facture
    const newInvoice = this.invoiceRepository.create({
      dateEnvoie: invoiceData.dateEnvoie,
      montant: invoiceData.montant,
      etatDePaiement: false, 
      abonnement: abonnement, 
    });

    return await this.invoiceRepository.save(newInvoice);
  }


  
  async assignInvoiceToUsersByAbonnementType(
    userIds: number[], 
    abonnementType: 'MENSUEL' | 'ANNUEL', 
    invoiceData: { dateEnvoie: Date; montant: number }, 
  ): Promise<InvoiceEntity[]> {
    const invoices: InvoiceEntity[] = [];
  
    for (const userId of userIds) {
      
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['abonnements', 'abonnements.typeAbonnement'], 
      });
  
      if (!user) {
        throw new NotFoundException(`Utilisateur non trouvé pour l'ID ${userId}`);
      }
  
      
      const abonnement = user.abonnements.find(
        (ab) => ab.typeAbonnement.type === TypeAbonnementEnum[abonnementType.toUpperCase()],
      );
  
      if (!abonnement) {
        throw new NotFoundException(
          `Aucun abonnement de type ${abonnementType} trouvé pour l'utilisateur ${userId}`,
        );
      }
  
      
      const newInvoice = this.invoiceRepository.create({
        dateEnvoie: invoiceData.dateEnvoie,
        montant: invoiceData.montant,
        etatDePaiement: false, 
        abonnement: abonnement, 
      });
  
      
      const savedInvoice = await this.invoiceRepository.save(newInvoice);
      invoices.push(savedInvoice); 
    }
  
    return invoices; 
  }

  async updatePaymentStatus(invoiceId: number, etatDePaiement: boolean): Promise<InvoiceEntity> {
    const invoice = await this.invoiceRepository.findOne({where:{id:invoiceId}});

    if (!invoice) {
      throw new NotFoundException(`Facture avec l'ID ${invoiceId} non trouvée`);
    }

    
    invoice.etatDePaiement = etatDePaiement;

   
    return this.invoiceRepository.save(invoice);
  }
}
