import { UserEntity } from "src/modules/user/entity/user.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('event')
export class EventEntity{
    @PrimaryGeneratedColumn()
    id:number;
    @Column()
    nom:string;
    @Column()
    dateDebut:Date;
    @Column()
    dateFin:Date;
    @ManyToMany(() => UserEntity, (user) => user.events) 
    users : UserEntity[]
}