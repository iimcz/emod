import {DigitalItem} from './digital-item';
import {MetadataInterface} from './metadata.interface';

export interface DigitalGroup {
  id_group: string;
  id_user: string;
  created: string;
  description?: string;
  items?: DigitalItem[];
  metadata?: MetadataInterface[];
}
