import { TypeAbonnementEntity } from "src/modules/type-abonnement/entity/type-abonnement";
import { UserEntity } from "src/modules/user/entity/user.entity";
import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('abonnement')
export class AbonnementEntity{
    @PrimaryGeneratedColumn()
    id:number;
    @Column()
    dateDebut:Date;
    @Column()
    dateFin:Date;
    @ManyToOne(() => UserEntity, user => user.abonnements)
    user: UserEntity;

    @ManyToOne(() => TypeAbonnementEntity, typeAbonnement => typeAbonnement.abonnements)
    typeAbonnement: TypeAbonnementEntity;


}