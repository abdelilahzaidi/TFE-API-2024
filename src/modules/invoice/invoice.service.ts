import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
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
    private dataSource: DataSource
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


  async getInvoiceById(invoiceId: number): Promise<any> {
    const invoice = await this.invoiceRepository.findOne({
      where: { id: invoiceId },
      relations: ['abonnement', 'abonnement.typeAbonnement', 'abonnement.user'],
    });
  
    console.log(invoice); // Vérifie le contenu ici
  
    if (!invoice) {
      throw new NotFoundException(`Facture avec l'ID ${invoiceId} introuvable`);
    }
  
    return invoice;
  }


  async getInvoicesByUserId(userId: number): Promise<InvoiceEntity[]> {
    const invoices = await this.invoiceRepository.find({
      where: { abonnement: { user: { id: userId } } },
      relations: ['abonnement', 'abonnement.typeAbonnement', 'abonnement.user'],
    });
  
    if (invoices.length === 0) {
      throw new NotFoundException(`Aucune facture trouvée pour l'utilisateur avec l'ID ${userId}`);
    }
  
    return invoices;
  }
  
  

  async actifUsers(): Promise<UserEntity[]> {
    
    const usersActif = await this.userRepository.find({
    where:{actif :true}
    });
  
    
   
  
    return await usersActif;
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
    abonnementType: 'Mensuel' | 'Annuel',
    invoiceData: { dateEnvoie: Date; montant: number }
  ): Promise<InvoiceEntity[]> {
    const invoices: InvoiceEntity[] = [];
    const actif = true;
  
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
  
    try {
      // Récupérer les utilisateurs actifs avec leurs abonnements
      const activeUsers = await queryRunner.manager.find(UserEntity, {
        where: { actif },
        relations: ['abonnements', 'abonnements.typeAbonnement', 'abonnements.invoices'],
      });
  
      if (activeUsers.length === 0) {
        throw new NotFoundException('Aucun utilisateur actif trouvé.');
      }
  
      for (const user of activeUsers) {
        // Trouver l'abonnement correspondant au type demandé (Mensuel ou Annuel)
        const abonnement = user.abonnements.find(
          (ab) => ab.typeAbonnement?.type === abonnementType
        );
  
        if (!abonnement) {
          console.warn(
            `Aucun abonnement de type ${abonnementType} trouvé pour l'utilisateur ${user.id}.`
          );
          continue;
        }
  
        // Vérifier si une facture existe déjà pour la même date d'envoi
        const existingInvoice = abonnement.invoices.find(
          (invoice) => invoice.dateEnvoie.getTime() === invoiceData.dateEnvoie.getTime()
        );
  
        if (existingInvoice) {
          console.warn(
            `Une facture existe déjà pour l'utilisateur ${user.id} à la date ${invoiceData.dateEnvoie}.`
          );
          continue;
        }
  
        // Créer la nouvelle facture
        const newInvoice = new InvoiceEntity();
        newInvoice.dateEnvoie = invoiceData.dateEnvoie;
        newInvoice.montant = invoiceData.montant;
        newInvoice.etatDePaiement = false; // Facture non payée par défaut
        newInvoice.abonnement = abonnement;
  
        // Sauvegarder la nouvelle facture
        const savedInvoice = await queryRunner.manager.save(newInvoice);
        invoices.push(savedInvoice);
      }
  
      // Committer la transaction
      await queryRunner.commitTransaction();
      return invoices;
  
    } catch (error) {
      // En cas d'erreur, rollback de la transaction
      await queryRunner.rollbackTransaction();
  
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      } else {
        console.error('Erreur interne lors de l\'attribution des factures:', error);
        throw new InternalServerErrorException('Une erreur est survenue lors de l\'attribution des factures.');
      }
    } finally {
      // Libérer le QueryRunner pour éviter les fuites
      await queryRunner.release();
    }
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
