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
    private readonly typeAbonnementByUser : TypeAbonnementService
  ) {}

  async all(): Promise<any[]> {
    return await this.invoiceRepository.find();
  }

  async createInvoice(id: number, montant: number): Promise<InvoiceEntity> {
    const abonnement = await this.abonnementRepository.findOne({
      where: { id },
    });
    if (!abonnement) {
      throw new Error('Abonnement not found for user');
    }

    const invoice = new InvoiceEntity();
    invoice.dateEnvoie = new Date();
    invoice.etatDePaiement = false;
    invoice.montant = montant; // Assurez-vous de fournir la valeur du montant ici
    invoice.abonnement = abonnement;
    const facture = this.invoiceRepository.save(invoice);
    console.log(facture)
    return facture
  }



  async createInvoiceBis(id: number): Promise<InvoiceEntity> {
    const typeAbonnement = await this.typeAbonnementByUser.findUsersByType(id)
    console.log('Type-abonnement ', typeAbonnement)
    const invoice = new InvoiceEntity();
    invoice.dateEnvoie = new Date();
    invoice.etatDePaiement = false;
    invoice.montant = typeAbonnement.tarif;
    return typeAbonnement
    // this.abonnementRepository.findOne({
    //   where: { id },
    // });
    // if (!abonnement) {
    //   throw new Error('Abonnement not found for user');
    // }

    // const invoice = new InvoiceEntity();
    // invoice.dateEnvoie = new Date();
    // invoice.etatDePaiement = false;
    // invoice.montant = montant; // Assurez-vous de fournir la valeur du montant ici
    // invoice.abonnement = abonnement;
    // const facture = this.invoiceRepository.save(invoice);
    // console.log(facture)
    // return facture
  }

  // async assignInvoiceToUser(
  //   invoiceId: number,
  //   userId: number,
  // ): Promise<InvoiceEntity> {
  //   const user = await this.userRepository.findOne({ where: { id: userId } });
  //   if (!user) {
  //     throw new Error('User not found');
  //   }
  //   const invoice = await this.invoiceRepository.findOne({
  //     where: { id: invoiceId },
  //   });
  //   if (!invoice) {
  //     throw new Error('Invoice not found');
  //   }
  //   const abonnement = await this.abonnementRepository.findOne({
  //     where: { id: userId },
  //   });
  //   console.log('abonnement ', abonnement);
  //   if (!abonnement) {
  //     throw new Error('User does not have a subscription');
  //   }
  //   invoice.abonnement = abonnement;

  //   return this.invoiceRepository.save(invoice);
  // }

  async assignInvoiceToUser(invoiceId: number, userId: number): Promise<InvoiceEntity> {
    const invoice = await this.invoiceRepository.findOne({
      where: { id: invoiceId },
      relations: ['abonnement'],
    });
  
    if (!invoice) {
      throw new NotFoundException(`Invoice with id ${invoiceId} not found`);
    }
  
    if (!invoice.abonnement) {
      throw new NotFoundException(`Abonnement for invoice with id ${invoiceId} not found`);
    }
  
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }
  
    invoice.abonnement.user = user;
    return await this.invoiceRepository.save(invoice);
  }


  // async getInvoicesByUser(userId: number): Promise<InvoiceEntity[]> {
  //   const user = await this.userRepository.findOne({
  //     where: { id: userId },
  //     relations: ['abonnements', 'abonnements.invoices'],
  //   });
  //   if (!user) {
  //     throw new Error('User not found');
  //   }
  //   console.log('user : ', user);

  //   const invoices = user.abonnements.reduce((acc, abonnement) => {
  //     acc.push(...abonnement.invoices);
  //     return acc;
  //   }, []);

  //   if (!invoices || invoices.length === 0) {
  //     throw new Error('No invoices found for the user');
  //   }

  //   return invoices;
  // }

  async getInvoicesByUser(userId: number): Promise<InvoiceEntity[]> {
    try {
      // Trouver l'utilisateur avec les relations nécessaires
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['abonnements', 'abonnements.invoices'],
      });
  
      // Vérifier si l'utilisateur existe
      if (!user) {
        throw new Error('User not found');
      }
      console.log('User found:', user);
  
      // Vérifier les abonnements de l'utilisateur
      if (!user.abonnements || user.abonnements.length === 0) {
        throw new Error('No abonnements found for the user');
      }
      console.log('Abonnements:', user.abonnements);
  
      // Récupérer les factures à partir des abonnements de l'utilisateur
      const invoices = user.abonnements.reduce((acc, abonnement) => {
        console.log(`Abonnement ID ${abonnement.id} invoices:`, abonnement.invoices);
        if (abonnement.invoices && abonnement.invoices.length > 0) {
          acc.push(...abonnement.invoices);
        }
        return acc;
      }, []);
  
      // Vérifier si des factures ont été trouvées
      if (invoices.length === 0) {
        throw new Error('No invoices found for the user');
      }
      console.log('Invoices:', invoices);
  
      return invoices;
    } catch (error) {
      console.error('Error in getInvoicesByUser:', error);
      throw error;
    }
  }
  


  async findByUserId(userId: number): Promise<any[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['abonnements', 'abonnements.typeAbonnement', 'abonnements.invoices'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Extract necessary information
    const invoices = user.abonnements.flatMap(abonnement => abonnement.invoices.map(invoice => ({
      id: invoice.id,
      dateEnvoie: invoice.dateEnvoie,
      etatDePaiement: invoice.etatDePaiement,
      montant: invoice.montant,
      nom: user.last_name, // Assuming these are properties of UserEntity
      prenom: user.first_name, // Assuming these are properties of UserEntity
      typeAbonnement: abonnement.typeAbonnement.type, // Assuming 'type' is the property in TypeAbonnementEntity
    })));

    return invoices;
  }

  async findById(id: number): Promise<InvoiceEntity> {
    return this.invoiceRepository.findOne({where:{id}});
  }

   // Nouvelle méthode pour obtenir les factures d'un utilisateur
   async getInvoicesByUserId(userId: number): Promise<InvoiceEntity[]> {
    const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['abonnements'] });
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    const invoices = await this.invoiceRepository.createQueryBuilder('invoice')
      .leftJoinAndSelect('invoice.abonnement', 'abonnement')
      .where('abonnement.userId = :userId', { userId })
      .getMany();

    return invoices;
  }

  async creerFacturesParTypeAbonnement(typeAbonnement: TypeAbonnementEnum): Promise<void> {
      // Étape 1 : Utilisation de QueryBuilder pour faire des joins
  const abonnements = await this.abonnementRepository
  .createQueryBuilder('abonnement')
  .innerJoinAndSelect('abonnement.user', 'user') // Join avec l'utilisateur
  .innerJoinAndSelect('abonnement.typeAbonnement', 'typeAbonnement') // Join avec le type d'abonnement
  .where('typeAbonnement.type = :type', { type: typeAbonnement }) // Filtrer par type d'abonnement
  .getMany();

if (abonnements.length === 0) {
  console.log(`Aucun abonnement trouvé pour le type ${typeAbonnement}`);
  return;
}

// Étape 2 : Générer une facture pour chaque abonnement
for (const abonnement of abonnements) {
  const nouvelleFacture = new InvoiceEntity();
  nouvelleFacture.dateEnvoie = new Date(); // La date d'envoi de la facture
  nouvelleFacture.etatDePaiement = false; // Par défaut, la facture n'est pas payée
  nouvelleFacture.montant = this.calculerMontant(abonnement); // Fonction pour calculer le montant
  nouvelleFacture.abonnement = abonnement; // Assigner l'abonnement à la facture
  
  // Sauvegarder la facture dans la base de données
  await this.invoiceRepository.save(nouvelleFacture);

  console.log(
    `Facture créée pour l'utilisateur ${abonnement.user.id} avec un montant de ${nouvelleFacture.montant}`,
  );
}
}
  

  private calculerMontant(abonnement: AbonnementEntity): number {
    // Vous pouvez personnaliser cette logique selon vos besoins
    const tarif = abonnement.typeAbonnement.tarif;
    switch (tarif) {
      case TarifEnum.MENSUEL:
        return 100; // Exemple de tarif mensuel
      case TarifEnum.ANNUEL:
        return 1000; // Exemple de tarif annuel
      default:
        return 0;
    }
  }


  // async creerFacturesParTypeAbonnement(typeAbonnement: TypeAbonnementEnum): Promise<void> {
  //   // Étape 1 : Récupérer les abonnements selon le type d'abonnement
  //   const abonnements = await this.abonnementRepository.find({
  //     where: { typeAbonnement: { type: typeAbonnement } },
  //     relations: ['user', 'typeAbonnement'],
  //   });

  //   if (abonnements.length === 0) {
  //     console.log(`Aucun abonnement trouvé pour le type ${typeAbonnement}`);
  //     return;
  //   }

  //   // Étape 2 : Générer une facture pour chaque abonnement
  //   for (const abonnement of abonnements) {
  //     const nouvelleFacture = new InvoiceEntity();
  //     nouvelleFacture.dateEnvoie = new Date(); // La date d'envoi de la facture
  //     nouvelleFacture.etatDePaiement = false; // Par défaut, la facture n'est pas payée
  //     nouvelleFacture.montant = this.calculerMontant(abonnement); // Fonction pour calculer le montant
  //     nouvelleFacture.abonnement = abonnement;

  //     // Sauvegarder la facture dans la base de données
  //     await this.invoiceRepository.save(nouvelleFacture);

  //     console.log(
  //       `Facture créée pour l'utilisateur ${abonnement.user.id} avec un montant de ${nouvelleFacture.montant}`,
  //     );
  //   }
  // }

  


  // async creerFacture(userId: number, typeAbonnementId: number, montant: number): Promise<InvoiceEntity> {
  //   // Récupérer l'abonnement de l'utilisateur avec le type d'abonnement
  //   const abonnement = await this.abonnementRepository.findOne({
  //     where: {
  //       user: { id: userId },
  //       typeAbonnement: { id: typeAbonnementId },
  //     },
  //   });

  //   if (!abonnement) {
  //     throw new NotFoundException('Abonnement non trouvé pour cet utilisateur et type.');
  //   }

  //   // Créer la nouvelle facture
  //   const facture = new InvoiceEntity();
  //   facture.dateEnvoie = new Date();
  //   facture.etatDePaiement = false;
  //   facture.montant = montant;
  //   facture.abonnement = abonnement;

  //   // Enregistrer la facture dans la base de données
  //   return this.invoiceRepository.save(facture);
  // }

  // // Méthode pour récupérer les factures par utilisateur, abonnement et date d'envoi
  // async getFactures(userId: number, typeAbonnementId: number, dateEnvoie: Date): Promise<InvoiceEntity[]> {
  //   return this.invoiceRepository.find({
  //     where: {
  //       abonnement: {
  //         user: { id: userId },
  //         typeAbonnement: { id: typeAbonnementId },
  //       },
  //       dateEnvoie,
  //     },
  //     relations: ['abonnement', 'abonnement.user', 'abonnement.typeAbonnement'],
  //   });
  // }
}
