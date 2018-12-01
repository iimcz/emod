import {MetadataInterface} from './metadata.interface';
import {UserInterface} from './user.interface';
import {DigitalGroup} from './digital-group';

export interface DigitalSetInterface {
  id_set: string;
  id_user: string;
  created: string;
  description?: string;

  metadata?: MetadataInterface[];
  groups?: DigitalGroup[];
  author?: UserInterface;
}
