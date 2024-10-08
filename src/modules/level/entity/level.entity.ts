import { LevelEnum } from 'src/common/enums/grade.enum';
import { ProgramEntity } from 'src/modules/program/entity/program.entity';
import { TechnichalTypeEntity } from 'src/modules/technical-type/entity/technical-type.entity';
import { UserEntity } from 'src/modules/user/entity/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

@Entity('level')
export class LevelEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'enum', enum: LevelEnum, default: LevelEnum.BLEU_0 })
  grade: LevelEnum;
  @Column()
  during: string;
  @OneToMany(() => UserEntity, (user) => user.level)
  users?: UserEntity[];

  @OneToOne(() => ProgramEntity, program => program.grade)
  @JoinColumn()
  program?: ProgramEntity;

  @ManyToOne(() => TechnichalTypeEntity, (typeTechnical) => typeTechnical.technichals)
typeTechnical: TechnichalTypeEntity;

}
