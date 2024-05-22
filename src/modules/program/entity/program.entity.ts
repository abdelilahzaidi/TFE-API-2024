import { ProgramEnum } from "src/common/enums/program.enum";
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('program')
export class ProgramEntity{
    @PrimaryGeneratedColumn()
    id : number;
    @Column({ type: 'enum', enum: ProgramEnum })
    title:string
}   