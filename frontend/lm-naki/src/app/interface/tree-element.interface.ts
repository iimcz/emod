export interface TreeElementInterface {
  dirs: {[key: string]: TreeElementInterface},
  file_count: number;
  new_files: number;
  expanded?: boolean;
}
