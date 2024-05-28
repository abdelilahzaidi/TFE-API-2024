import { TypeEventEntity } from "src/modules/type-event/entity/type-event.entity";
import { UserEntity } from "src/modules/user/entity/user.entity";

export interface Event {
    id: number;
    nom: string;
    dateDebut: Date;
    dateFin: Date;
    users: UserEntity[];
    type: TypeEventEntity;
  }