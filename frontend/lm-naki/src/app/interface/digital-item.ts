import {LinkInterface} from './link.interface';
import {MetadataInterface} from './metadata.interface';
import {SafeResourceUrl} from '@angular/platform-browser';

export interface DigitalItem {
  id_item: string;
  id_user: string;
  description: string;
  mime: string;
  created?: string;
  links?: LinkInterface[];
  metadata?: MetadataInterface[];
  url?: SafeResourceUrl;
  group_ids?: string[];
  path?: string;
}
