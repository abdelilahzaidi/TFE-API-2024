import { SeanceEntity } from "src/modules/seance/entity/seance.entity";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";

export type DayOfWeek = 'lundi' | 'mardi' | 'mercredi' | 'jeudi' | 'vendredi' | 'samedi' | 'dimanche';

@Entity('horaire')
export class HoraireEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type : 'time'})
  heureDebut: Date;
  @Column({type : 'time'})
  heureFin: Date;
  @Column()
  jour: DayOfWeek;
  @OneToMany(() => SeanceEntity, (seance) => seance.horaire)
  seances: SeanceEntity[];
}