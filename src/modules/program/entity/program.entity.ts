import { ProgramEnum } from "src/common/enums/program.enum";
import { LevelEntity } from "src/modules/level/entity/level.entity";
import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from "typeorm";

@Entity('program')
export class ProgramEntity{
    @PrimaryGeneratedColumn()
    id : number;
    @Column()
    title?: string;     
    //@OneToOne(() => LevelEntity, level => level.program,{eager:true})
    @OneToOne(() => LevelEntity, level => level.program)
    grade?: LevelEntity; 

    //active: boolean = true
} 