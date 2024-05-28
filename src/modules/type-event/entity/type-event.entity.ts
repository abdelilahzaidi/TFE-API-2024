import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('event-type')
export class TypeEventEntity{
    @PrimaryGeneratedColumn()
    id:number;
    @Column()
    type:string;
}