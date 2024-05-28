
import { ProgramEnum } from 'src/common/enums/program.enum';
import { LevelEntity } from 'src/modules/level/entity/level.entity';
import { TechnichalTypeEntity } from 'src/modules/technical-type/entity/technical-type.entity';
import { TechnichalEntity } from 'src/modules/technichal/entity/technichal.entity';

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity('program')
export class ProgramEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  title?: string;
  //@OneToOne(() => LevelEntity, level => level.program,{eager:true})
  @OneToOne(() => LevelEntity, (level) => level.program)
  grade?: LevelEntity;
  @ManyToMany(
    type =>TechnichalEntity,
    TechnichalEntity =>TechnichalEntity.programs
  )
  @JoinTable()
  technicals:TechnichalEntity[]; 
}
