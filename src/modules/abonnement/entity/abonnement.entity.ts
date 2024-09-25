import { InvoiceEntity } from 'src/modules/invoice/entity/invoice.entity';
import { TypeAbonnementEntity } from 'src/modules/type-abonnement/entity/type-abonnement';
import { UserEntity } from 'src/modules/user/entity/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('abonnement')
export class AbonnementEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  dateDebut: Date;
  @Column()
  dateFin: Date;
  @ManyToOne(() => UserEntity, (user) => user.abonnements)
  user: UserEntity;

  @ManyToOne(
    () => TypeAbonnementEntity,
    (typeAbonnement) => typeAbonnement.abonnements,
    { onDelete: 'SET NULL' },
  )
  typeAbonnement: TypeAbonnementEntity;

  @OneToMany(() => InvoiceEntity, (invoice) => invoice.abonnement, {
    onDelete: 'SET NULL',
  })
  invoices: InvoiceEntity[];
}
