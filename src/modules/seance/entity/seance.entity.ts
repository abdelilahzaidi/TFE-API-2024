import { CourEntity } from 'src/modules/cour/entity/cour.entity';
import { DateCourEntity } from 'src/modules/date-cour/entity/date.entity';
import { HoraireEntity } from 'src/modules/horaire/entity/horaire.entity';
import { UserEntity } from 'src/modules/user/entity/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  ManyToOne,
} from 'typeorm';

@Entity('Seance')
export class SeanceEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => HoraireEntity, (horaire) => horaire.seances)
  horaire: HoraireEntity;

  @ManyToOne(() => CourEntity, (cour) => cour.seances)
  cour: CourEntity;
  @ManyToOne(() => DateCourEntity, (dateCour) => dateCour.seances)
  dateCour: DateCourEntity;
  @ManyToMany(() => UserEntity, (user) => user.seances)
  users: UserEntity[];
}
