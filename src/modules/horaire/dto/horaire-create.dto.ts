import { IsIn, IsNotEmpty } from 'class-validator';
import { DayOfWeek } from '../entity/horaire.entity';
import { Compare } from 'src/common/decorators/isGreaterThanDate.decorator';

export class CreateHoraireDto {
  @IsNotEmpty()
  @IsNotEmpty()
  @Compare(({heureDebut, heureFin}: CreateHoraireDto) => heureDebut < heureFin, { message: "L'heure de fin de l'horaire doit etre postérieur à l'heure de début de l'horaire" })
  heureDebut: string;

  @IsNotEmpty()
  @Compare(({heureDebut, heureFin}: CreateHoraireDto) => heureDebut < heureFin, { message: "L'heure de fin de l'horaire doit etre postérieur à l'heure de début de l'horaire" })
  heureFin: string;

  @IsNotEmpty()
  @IsIn(['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'])
  jour: DayOfWeek;
}
