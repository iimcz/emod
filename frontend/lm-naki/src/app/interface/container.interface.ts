import {DigitalItem} from './digital-item';

export interface ContainerInterface {
  id_container: string;
  id_view: string;
  type: string;
  x: number;
  y: number;
  z: number;
  width: number;
  height: number;
  item_ids: string[];
  items?: DigitalItem[];
  data?: string;
}
