import { UserEntity } from "src/modules/user/entity/user.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('abonnement')
export class AbonnementEntity{
    @PrimaryGeneratedColumn()
    id:number;
    @Column()
    dateDebut:Date;
    @Column()
    dateFin:Date;
    @ManyToMany(() => UserEntity, (user) => user.abonnements)
    users:UserEntity[]

}