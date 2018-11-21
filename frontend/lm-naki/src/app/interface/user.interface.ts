import {Rights} from '../rights.enum';

export interface UserInterface {
  id_user: string;
  username: string;
  fullname: string;
  auth_level: Rights;
  passwd?: string;
  token?: string;
}
