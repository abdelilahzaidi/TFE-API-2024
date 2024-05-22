import { LevelEnum } from "src/common/enums/grade.enum";
import { UserEntity } from "src/modules/user/entity/user.entity";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, JoinColumn } from "typeorm";

@Entity('level')
export class LevelEntity{
    @PrimaryGeneratedColumn()
    id : number;
    @Column({ type: 'enum', enum: LevelEnum, default: LevelEnum.BLEU_0 })
    grade: LevelEnum; 
    @Column()
    during : string
    // @OneToMany(() => UserEntity, user => user.level)
    // users?: UserEntity[];
    // @OneToOne(() => ProgramEntity)
    // @JoinColumn()
    // program?: ProgramEntity;
}