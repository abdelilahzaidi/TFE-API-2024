import { ProgramEntity } from "src/modules/program/entity/program.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('technical-type')
export class TechnichalTypeEntity{
    @PrimaryGeneratedColumn()
    id:number;
    @Column()
    type:string;
    @ManyToMany(
        type => ProgramEntity,
        program =>program.technicalTypes
    )
    programs:ProgramEntity[];
}