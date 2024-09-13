import {
  Column,
  Entity, 
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('lieu')
export class LieuEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  rue: string;

  @Column()
  commune: string;

  @Column()
  ville: string;
}
