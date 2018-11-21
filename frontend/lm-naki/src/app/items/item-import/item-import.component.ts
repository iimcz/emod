import {Component, OnInit} from '@angular/core';
import {NakiService} from '../../naki.service';
import {FileTreeInterface} from '../../interface/filetree.interface';
import {FileTreeElementInterface} from '../../interface/filetree-element.interface';
import {APIResponse} from '../../apiresponse.interface';
import {DigitalItem} from '../../interface/digital-item';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MetakeyInterface} from '../../interface/metakey.interface';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {Location} from '@angular/common';
import {MetadataInterface} from '../../interface/metadata.interface';
import {MatDialog} from '@angular/material';
import {FindGroupDialogComponent} from '../../find-group/find-group-dialog/find-group-dialog.component';
import {DigitalGroup} from '../../interface/digital-group';
import {Utils} from '../../naki.utils';
import {TreeElementInterface} from '../../interface/tree-element.interface';

interface CheckedValue<T> {
  checked: boolean;
  value: T;
  item: DigitalItem;
  url: SafeResourceUrl;
}

interface WrappedValue<T> {
  wrapped: boolean;
  value: CheckedValue<T>;
}

@Component({
  selector: 'app-item-import',
  templateUrl: './item-import.component.html',
  styleUrls: ['./item-import.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*', display: 'content'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class ItemImportComponent implements OnInit {
  public tree: TreeElementInterface | undefined;
  public flat_tree: CheckedValue<FileTreeElementInterface>[] | undefined;
  public flat_tree2: (CheckedValue<FileTreeElementInterface> | WrappedValue<FileTreeElementInterface>)[] | undefined;
  public selectedItems: Map<string, CheckedValue<FileTreeElementInterface>> = new Map<string, CheckedValue<FileTreeElementInterface>>();
  public displayedColumns = ['check', 'mime', 'path'];
  public mimeTypes: string[] = [];
  public selectedMime: string | undefined;
  public metakeys: MetakeyInterface[] = [];
  public show_used = false;
  public common_metadata: MetadataInterface[] = [];
  public use_group = false;
  public selected_group: DigitalGroup | undefined;
  public loaded_path = '';
  constructor(private sanitizer: DomSanitizer,
              public location: Location,
              public dialog: MatDialog,
              public nakiService: NakiService) {
  }

  public get_metadata = Utils.get_metadata;

  ngOnInit() {
    this.reloadData();
  }

  public reloadData(): void {
    this.flat_tree2 = [];
    this.flat_tree = [];
    Promise.all([
      this.nakiService.get_dir_tree(),
      this.nakiService.get_metakey_list()])
      .then((res: [APIResponse<TreeElementInterface>, APIResponse<MetakeyInterface[]>]) => {
        this.tree = res[0].data;
        if (res[1].data !== undefined) {
          this.metakeys = <MetakeyInterface[]>res[1].data;
        } else {
          console.error('No metakeys!');
        }
        // this.flat_tree = [];
        // if (this.tree !== undefined) {
        //   this.load_files(this.tree);
        // }
        // console.log(this.flat_tree);
        // this.flat_tree.sort((a, b) => a.value.path.localeCompare(b.value.path));
        this.selectedItems.clear();
        // this.mimeTypes = this.flat_tree.map(e => e.value.mime).reduce((acc: string[], e: string) => {
        //   if (acc.indexOf(e) < 0) {
        //     acc.push(e);
        //   }
        //   return acc;
        // }, []);
        this.selectedMime = undefined;
        this.filter_items();
      });
  }

  public selectItem(item: CheckedValue<FileTreeElementInterface>, state: boolean) {
    console.log(state);
    if (state) {
      this.selectedItems.set(item.value.path, item);
    } else {
      this.selectedItems.delete(item.value.path);
    }
  }

  public process_import(): void {
    const promises = Array.from(this.selectedItems).map(val => this.process_single_import(val[1]));
    Promise.all(promises).then((res: APIResponse<DigitalItem>[]) => {
      console.log(res);
      this.reloadData();
    });
  }

  public isWrapped(index: number, obj: any) {
    return obj.hasOwnProperty('wrapped');
  }

  public filter_items(): void {
    console.log('filter', this.selectedMime, this.show_used);

    this.flat_tree2 = this.flat_tree ? this.flat_tree.filter(e =>
      (!this.selectedMime || e.value.mime === this.selectedMime) &&
      (this.show_used || !e.value.used))
      .reduce((acc: (CheckedValue<FileTreeElementInterface>|WrappedValue<FileTreeElementInterface>)[], cur) => acc.concat(cur, {value: cur, wrapped: true}), []) : [];
  }

  private prepare_metadata(file: FileTreeElementInterface): MetadataInterface[] {
    const metadata: MetadataInterface[] = [{
      id: '',
      target: 'item',
      key: 'description',
      value: file.name
    }];
    if (file.metadata !== undefined) {
      for (const m of Object.keys(file.metadata)) {
        metadata.push({
          id: '',
          target: 'item',
          key: m,
          value: file.metadata[m]
        });
      }
    }
    return metadata;
  }

  private load_files(root: FileTreeInterface): void {
    if (!this.flat_tree) {
      this.flat_tree = [];
    }
    if (root.files) {
      const uinfo = this.nakiService.get_user_info();
      const user = uinfo ? uinfo.id_user : '';
      for (const file of root.files) {
        const uri = 'storage:' + file.path;

        this.flat_tree.push({
          checked: false,
          value: file,
          item: {
            id_item: '',
            mime: file.mime,
            description: '',
            id_user: user,
            created: '',
            links: [{
              id_link: '',
              id_item: '',
              id_user: user,
              type: 'data',
              description: 'imported path',
              uri: uri
            }],
            metadata: this.prepare_metadata(file)
          },
          url: this.sanitizer.bypassSecurityTrustResourceUrl(this.nakiService.get_resource_url(uri))
        });
      }
    }
    if (root.dirs) {
      for (const dir in root.dirs) {
        if (root.dirs.hasOwnProperty(dir)) {
          this.load_files(root.dirs[dir]);
        }
      }
    }
  }

  private process_single_import(item: CheckedValue<FileTreeElementInterface>): Promise<APIResponse<DigitalItem>> {
    if (!item.item.metadata) {
      item.item.metadata = [];
    }
    const item_meta = item.item.metadata;
    for (const meta of this.common_metadata) {
      if (item_meta.findIndex(e => e.key === meta.key) === -1) {
        item_meta.push(meta);
      }
    }
    if (this.use_group && this.selected_group) {
      item.item.group_ids = [this.selected_group.id_group];
    }
    console.log(item);
    return this.nakiService.create_item(item.item);
  }

  public select_group(): void {
    const dialogRef = this.dialog.open(FindGroupDialogComponent);
    dialogRef.afterClosed().subscribe((res: DigitalGroup) => {
      console.log(res);
      if (res) {
        this.nakiService.get_group(res.id_group).then((grp: APIResponse<DigitalGroup>) => {
          this.selected_group = grp.data;
        });
      }
    });
  }

  public load_dir(path: string): void {
    console.log(path);
    this.flat_tree = undefined;
    this.flat_tree2 = undefined;
    this.loaded_path = '';
    this.nakiService.get_dir_content(path).then((res: APIResponse<FileTreeInterface>) => {
      console.log(res);
      this.flat_tree = [];
      if (res.data !== undefined) {
        this.load_files(res.data);
        this.loaded_path = res.data.path;
      }
      console.log(this.flat_tree);
      this.flat_tree.sort((a, b) => a.value.path.localeCompare(b.value.path));
      this.selectedItems.clear();
      this.mimeTypes = this.flat_tree.map(e => e.value.mime).reduce((acc: string[], e: string) => {
        if (acc.indexOf(e) < 0) {
          acc.push(e);
        }
        return acc;
      }, []);
      this.selectedMime = undefined;
      this.filter_items();
    });
  }
}

