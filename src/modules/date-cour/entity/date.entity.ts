import { SeanceEntity } from "src/modules/seance/entity/seance.entity";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";

@Entity('datecour')
export class DateCourEntity{
    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    dateCour: Date;

    @OneToMany(() => SeanceEntity, (seance) => seance.dateCour)
    seances: SeanceEntity[]; 
    
}