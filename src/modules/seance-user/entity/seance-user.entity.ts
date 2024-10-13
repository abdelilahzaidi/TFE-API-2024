import { SeanceEntity } from 'src/modules/seance/entity/seance.entity';
import { UserEntity } from 'src/modules/user/entity/user.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';

@Entity('seance_user')



export class SeanceUserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => SeanceEntity, (seance) => seance.seanceUsers, {
    onDelete: 'CASCADE', // Suppression en cascade
  })
  seance: SeanceEntity;

  @ManyToOne(() => UserEntity, (user) => user.seanceUsers)
  user: UserEntity;

  @Column({ default: false })
  presence: boolean;
  @Column()
  userId: number;

  @Column()
  seanceId: number;
}


