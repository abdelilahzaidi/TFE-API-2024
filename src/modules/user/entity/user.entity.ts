import { Exclude } from "class-transformer";
import { UserGender } from "src/common/enums/gender.enum";
import { UserStatus } from "src/common/enums/status.enum";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";

@Entity('user')
export class UserEntity {
    @PrimaryGeneratedColumn()
    id?: number;
  
    @Column()
    first_name: string;
  
    @Column()
    last_name: string;
  
    @Column({ type: 'enum', enum: UserGender, default: UserGender.MALE })
    gender: UserGender;
  
    @Column()
    birthDate: Date;
  
    @Column()
    rue: string;
  
    @Column()
    commune: string;
  
    @Column()
    ville: string;
  
    @Column({ default: true })
    actif: boolean;
  
    @Column()
    attributionDate: Date;
  
    @Column()
    gsm: string;
  
    @Column({ unique: true })
    email: string;
  
    @Column()
    @Exclude()
    password: string;
  
    @Column({ type: 'enum', enum: UserStatus, default: UserStatus.MEMBER })
    status: UserStatus;
}
