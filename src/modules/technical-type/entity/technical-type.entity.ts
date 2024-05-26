import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('technical-type')
export class TechnichalTypeEntity{
    @PrimaryGeneratedColumn()
    id:number;
    @Column()
    type:string;
}