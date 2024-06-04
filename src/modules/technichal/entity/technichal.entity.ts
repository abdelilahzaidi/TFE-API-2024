import { ProgramEntity } from 'src/modules/program/entity/program.entity';
import { TechnichalTypeEntity } from 'src/modules/technical-type/entity/technical-type.entity';
import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('technichal')
export class TechnichalEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  nom: string; 
  @Column()
  description: string;
  @ManyToMany(() => ProgramEntity, (program) => program.technicals,{eager:true})
  programs: ProgramEntity[];
  @ManyToOne(() => TechnichalTypeEntity, (technichalType) => technichalType.technichals, { nullable: true, eager :true })
    technichalType: TechnichalTypeEntity;
}
