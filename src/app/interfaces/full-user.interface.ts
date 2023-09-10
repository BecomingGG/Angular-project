import firebase from 'firebase/compat/app';
import { AdditionalInfoUser } from './additional-user.interface';

export interface FullUserInterface {
  user: firebase.User | null;
  additionalInfo: AdditionalInfoUser | null;
}
