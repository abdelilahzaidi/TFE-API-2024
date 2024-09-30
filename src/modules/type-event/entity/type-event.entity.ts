import { TypeEventEnum } from 'src/common/enums/type-event.enum';
import { EventEntity } from 'src/modules/event/entity/event.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('event-type')
export class TypeEventEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'enum', enum: TypeEventEnum, default: TypeEventEnum.REPRISE })
  type: TypeEventEnum;
  @OneToMany(() => EventEntity, (event) => event.typeEvents) 
  events: EventEntity[];
}
