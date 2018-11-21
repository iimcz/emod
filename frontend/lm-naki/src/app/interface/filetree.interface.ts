import {FileTreeElementInterface} from './filetree-element.interface';

export interface FileTreeInterface {
  'path': string;
  'dirs': { [key: string]: FileTreeInterface };
  'files': FileTreeElementInterface[];
}
