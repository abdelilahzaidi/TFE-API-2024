import { TypeEventEnum } from 'src/common/enums/type-event.enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('event-type')
export class TypeEventEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'enum', enum: TypeEventEnum, default: TypeEventEnum.REPRISE })
  type: TypeEventEnum;
}
