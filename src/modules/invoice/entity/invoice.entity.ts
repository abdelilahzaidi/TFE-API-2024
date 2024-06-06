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
    @ManyToOne(()=>AbonnementEntity,(abonnement)=>abonnement.invoices)
    abonnement : AbonnementEntity
}