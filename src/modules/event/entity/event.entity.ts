import { TypeEventEntity } from "src/modules/type-event/entity/type-event.entity";
import { UserEntity } from "src/modules/user/entity/user.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

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
    @ManyToMany(() => UserEntity, (user) => user.events, { onDelete: 'CASCADE' }) 
    users : UserEntity[];
    @ManyToOne(() => TypeEventEntity, (typeEvent) => typeEvent.events, { onDelete: 'SET NULL' }) 
    typeEvents: TypeEventEntity;
}