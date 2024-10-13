import { AbonnementEntity } from "src/modules/abonnement/entity/abonnement.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('facture')
export class InvoiceEntity{
    @PrimaryGeneratedColumn()
    id : number;
    @Column()
    dateEnvoie :Date;
    @Column()
    etatDePaiement : boolean;
    @Column()
    montant : number;
    // @ManyToOne(()=>AbonnementEntity,(abonnement)=>abonnement.invoices, {cascade:['remove']})
    // abonnement : AbonnementEntity
    @ManyToOne(() => AbonnementEntity, (abonnement) => abonnement.invoices, {
        onDelete: 'SET NULL',  // Lorsque l'abonnement est supprimé, la facture reste mais sans référence à un abonnement.
      })
      abonnement: AbonnementEntity;
}