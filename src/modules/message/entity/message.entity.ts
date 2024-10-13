import { UserEntity } from 'src/modules/user/entity/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  ManyToOne,
} from 'typeorm';

// @Entity('message')
// export class MessageEntity {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column()
//   titre: string;

//   @Column()
//   contenu: string;

//   @Column()
//   dateHeureEnvoie: Date;

//   @ManyToMany(() => UserEntity, (user) => user.receivedMessages)
//   @JoinTable({
//       name: 'message_user',
//       joinColumn: { name: 'messageId', referencedColumnName: 'id' },
//       inverseJoinColumn: { name: 'userId', referencedColumnName: 'id' },
//   })
//   receivers: UserEntity[];

//   @ManyToOne(() => UserEntity, (user) => user.sentMessages)
//   sender: UserEntity;
// }

@Entity('message')
export class MessageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titre: string;

  @Column()
  contenu: string;

  @Column({ type: 'timestamp' })
  dateHeureEnvoie: Date;

  @ManyToOne(() => UserEntity, (user) => user.sentMessages)
  sender: UserEntity;

  @ManyToMany(() => UserEntity, (user) => user.receivedMessages)
  @JoinTable({
    name: 'message_user',
    joinColumn: { name: 'messageId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'userId', referencedColumnName: 'id' },
  })
  receivers: UserEntity[];
}



