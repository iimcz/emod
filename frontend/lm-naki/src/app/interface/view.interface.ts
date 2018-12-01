import {ContainerInterface} from './container.interface';
import {MetadataInterface} from './metadata.interface';
import {DigitalItem} from './digital-item';
import {UserInterface} from './user.interface';

export interface ViewInterface {
  id_view: string;
  id_user: string;
  created?: string;
  public: number;
  metadata?: MetadataInterface[];
  items?: DigitalItem[];
  containers?: ContainerInterface[];
  author?: UserInterface;
}


