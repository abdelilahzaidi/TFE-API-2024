import { ProgramEntity } from "src/modules/program/entity/program.entity";
import { TechnichalEntity } from "src/modules/technichal/entity/technichal.entity";
import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('technical-type')
export class TechnichalTypeEntity{
    @PrimaryGeneratedColumn()
    id:number;
    @Column()
    type:string;
    @OneToMany(() => TechnichalEntity, (technichal) => technichal.technichalType)
    technichals?: TechnichalEntity[];

}