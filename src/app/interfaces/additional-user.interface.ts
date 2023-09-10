import { UserRoleEnum } from '../enums';

export interface AdditionalInfoUser {
  id: string;
  uid: string;
  role: UserRoleEnum;
  name: string | null;
  lastName: string | null;
  phoneNumber: string | null;
  imageURL: string | null;
  email: string | null;
}
