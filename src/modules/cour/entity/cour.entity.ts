import { LieuEntity } from "src/modules/lieu/entity/lieu.entity";
import { SeanceEntity } from "src/modules/seance/entity/seance.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";

@Entity('cour')
export class CourEntity{
    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    objectifDuCour: string;

   
    @ManyToOne(() => LieuEntity, lieu => lieu.id, { nullable: true })
    lieu: LieuEntity;

    @OneToMany(() => SeanceEntity, (seance) => seance.cour)
    seances: SeanceEntity[];

}
