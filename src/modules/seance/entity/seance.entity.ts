import { CourEntity } from 'src/modules/cour/entity/cour.entity';
import { DateCourEntity } from 'src/modules/date-cour/entity/date.entity';
import { HoraireEntity } from 'src/modules/horaire/entity/horaire.entity';
import { SeanceUserEntity } from 'src/modules/seance-user/entity/seance-user.entity';
import { UserEntity } from 'src/modules/user/entity/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  ManyToOne,
  JoinTable,
} from 'typeorm';

// @Entity('Seance')
// export class SeanceEntity {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @ManyToOne(() => HoraireEntity, (horaire) => horaire.seances)
//   horaire: HoraireEntity;

//   @ManyToOne(() => CourEntity, (cour) => cour.seances)
//   cour: CourEntity;

//   @ManyToOne(() => DateCourEntity, (dateCour) => dateCour.seances)
//   dateCour: DateCourEntity;

//   @OneToMany(() => SeanceUserEntity, (seanceUser) => seanceUser.seance)
//   seanceUsers: SeanceUserEntity[]; 

//   @ManyToMany(() => UserEntity, (user) => user.seances)
// @JoinTable({

// })
// users: UserEntity[];
// }

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

  @OneToMany(() => SeanceUserEntity, (seanceUser) => seanceUser.seance, {
    cascade: true, // Pour les mises à jour et suppressions
  })
  seanceUsers: SeanceUserEntity[];

  @ManyToMany(() => UserEntity, (user) => user.seances)
  @JoinTable()
  users: UserEntity[];
}

