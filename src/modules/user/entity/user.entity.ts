import { Exclude } from 'class-transformer';
import { UserGender } from 'src/common/enums/gender.enum';
import { UserStatus } from 'src/common/enums/status.enum';
import { EventEntity } from 'src/modules/event/entity/event.entity';
import { LevelEntity } from 'src/modules/level/entity/level.entity';
import { MessageEntity } from 'src/modules/message/entity/message.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  OneToMany,
  JoinTable,
} from 'typeorm';

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
  @ManyToOne(() => LevelEntity, (level) => level.users, { nullable: true })
  level: LevelEntity;
  @ManyToMany(() => MessageEntity, (message) => message.receivers)
  receivedMessages: MessageEntity[];

  @OneToMany(() => MessageEntity, (message) => message.sender)
  sentMessages: MessageEntity[];

  @ManyToMany(() => EventEntity, (event) => event.users)
  @JoinTable({
    name: 'user_event',
    joinColumn: {
      name: 'userId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'eventId',
      referencedColumnName: 'id',
    },
  })
  events: EventEntity[];
}
