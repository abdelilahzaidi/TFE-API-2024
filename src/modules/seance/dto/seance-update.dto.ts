import { DayOfWeek } from "./seance-create.dto";

export class UpdateSeanceDto {
    objectifDuCour: string; // Assurez-vous qu'il est défini ici
    rue?: string;
    commune?: string;
    ville?: string;
    jour?: DayOfWeek;
    heureDebut?: string;
    heureFin?: string;
    date?: Date;
}

  