import { UserGender } from "src/common/enums/gender.enum";

export class UserInfoDTO {
    first_name: string;
    last_name: string;
    email: string;
    gender: UserGender;
    level: string; // Grade ou Niveau
  }