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
    return await this.invoiceRepository.find({select:[],relations:['abonnement','abonnement.typeAbonnement']});
  }



  // Méthode pour assigner une facture à un utilisateur par abonnement
  async assignInvoiceToUser(
    userId: number,
    abonnementId: number,
    invoiceData: { dateEnvoie: Date; montant: number }
  ): Promise<InvoiceEntity> {
    // Trouver l'utilisateur
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['abonnements'],
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    // Vérifier si l'abonnement appartient à l'utilisateur
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
      etatDePaiement: false, // Par défaut, la facture n'est pas payée
      abonnement: abonnement, // Associe l'abonnement à la facture
    });

    return await this.invoiceRepository.save(newInvoice);
  }


  
  async assignInvoiceToUsersByAbonnementType(
    userIds: number[], // Liste des utilisateurs à associer
    abonnementType: 'MENSUEL' | 'ANNUEL', // Type d'abonnement
    invoiceData: { dateEnvoie: Date; montant: number }, // Données de la facture
  ): Promise<InvoiceEntity[]> {
    const invoices: InvoiceEntity[] = [];
  
    for (const userId of userIds) {
      // Trouver l'utilisateur et ses abonnements
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['abonnements', 'abonnements.typeAbonnement'], // Récupérer les types d'abonnements
      });
  
      if (!user) {
        throw new NotFoundException(`Utilisateur non trouvé pour l'ID ${userId}`);
      }
  
      // Filtrer l'abonnement de l'utilisateur par le type d'abonnement (mensuel ou annuel)
      const abonnement = user.abonnements.find(
        (ab) => ab.typeAbonnement.type === TypeAbonnementEnum[abonnementType.toUpperCase()],
      );
  
      if (!abonnement) {
        throw new NotFoundException(
          `Aucun abonnement de type ${abonnementType} trouvé pour l'utilisateur ${userId}`,
        );
      }
  
      // Créer une nouvelle facture pour cet abonnement
      const newInvoice = this.invoiceRepository.create({
        dateEnvoie: invoiceData.dateEnvoie,
        montant: invoiceData.montant,
        etatDePaiement: false, // Par défaut, la facture n'est pas payée
        abonnement: abonnement, // Associe l'abonnement à la facture
      });
  
      // Sauvegarder la facture et l'ajouter à la liste des factures assignées
      const savedInvoice = await this.invoiceRepository.save(newInvoice);
      invoices.push(savedInvoice); // Ajouter la facture créée à la liste
    }
  
    return invoices; // Retourner toutes les factures créées
  }
}
