import { TypeAbonnementEnum } from 'src/common/enums/abonnement.enum';
import { TarifEnum } from 'src/common/enums/tarif.enum';
import { AbonnementEntity } from 'src/modules/abonnement/entity/abonnement.entity';
import { PrimaryGeneratedColumn, Column, Entity, OneToMany } from 'typeorm';

@Entity('abonnement-type')
export class TypeAbonnementEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({
    type: 'enum',
    enum: TypeAbonnementEnum,
    default: TypeAbonnementEnum.MENSUEL,
  })
  type: TypeAbonnementEnum;

  @Column({ type: 'enum', enum: TarifEnum, default: TarifEnum.MENSUEL })
  tarif: TarifEnum;
  @OneToMany(() => AbonnementEntity, (abonnement) => abonnement.typeAbonnement)
  abonnements: AbonnementEntity[];
}
