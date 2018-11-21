export interface FileTreeElementInterface {
  name: string;
  path: string;
  mime: string;
  metadata?: {[key: string]: string};
  used?: boolean;
}
