import {Component, HostListener, OnInit} from '@angular/core';
import {NakiService} from '../../naki.service';
import {DropEvent} from 'ng-drag-drop';
import {NakiConfig} from '../../config';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

import {DigitalItem} from '../../interface/digital-item';
import {FindItemDialogComponent} from '../../find-item/find-item-dialog/find-item-dialog.component';
import {NakiDefaultPlayerService} from '../../naki-default-player.service';
import {ActivatedRoute} from '@angular/router';
import {ViewInterface} from '../../interface/view.interface';
import {APIResponse} from '../../apiresponse.interface';
import {Utils} from '../../naki.utils';
import {Container} from '@angular/compiler/src/i18n/i18n_ast';
import {ContainerInterface} from '../../interface/container.interface';
import {Subject} from 'rxjs';
import {FindGroupDialogComponent} from '../../find-group/find-group-dialog/find-group-dialog.component';
import {DigitalGroup} from '../../interface/digital-group';
import {EditGroupDialogComponent} from '../../find-group/edit-group-dialog/edit-group-dialog.component';
import {ContainerEventInterface} from '../../interface/container-event.interface';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {
  public view: ViewInterface | undefined;
  // public type = 'image';
  // public containers: string[] = [];
  //
  // public items: DigitalItem[] = [];
  public newItemSubjects: Map<string, Subject<string>> = new Map<string, Subject<string>>();
  public viewSubjects: Map<string, Subject<ContainerEventInterface>> = new Map<string, Subject<ContainerEventInterface>>();

  public get_metadata = Utils.get_metadata;

  public prefixes: string[] = [];

  public selecting_items = false;
  public selected_items: DigitalItem[] = [];

  public mode2 = 'play';

  private eventCache: Map<string, ContainerEventInterface> = new Map<string, ContainerEventInterface>();

  constructor(public dialog: MatDialog,
              private route: ActivatedRoute,
              public defaultPlayer: NakiDefaultPlayerService,
              public nakiService: NakiService) {
    // this.nakiService.get_file_tree();
  }

  @HostListener('document:keydown', ['$event'])
  keyDown(event: KeyboardEvent) {
    if (event.key === 'Control') {
      this.mode2 = 'edit';
    }
  }

  @HostListener('document:keyup', ['$event'])
  keyUp(event: KeyboardEvent) {
    if (event.key === 'Control') {
      this.mode2 = 'play';
    }
  }

  @HostListener('window:blur', ['$event'])
  blur(event: Event) {
    // Let's switch to play mode when the window loses focus. Otherwise the canvas could remain in edit mode even after ctrl key is released
    this.mode2 = 'play';
  }

  public add_container(item: DigitalItem | DigitalItem[], x: number, y: number) {
    // this.view.containers.push(this.nakiService.generate_container(this.defaultPlayer.getPlayerType(item.mime), x, y, item.id_item));
    // console.log(this.view.containers);
    if (!this.view) {
      return;
    }
    let items: string[] = [];
    let type = '';
    if ((<DigitalItem[]>item).length !== undefined) {
      items = (<DigitalItem[]>item).map(e => e.id_item);
      type = this.defaultPlayer.getPlayerType((<DigitalItem[]>item)[0].mime);
    } else {
      items = [(<DigitalItem>item).id_item];
      type = this.defaultPlayer.getPlayerType((<DigitalItem>item).mime);
    }
    this.add_container_with_type(type, items, x, y);
  }
  private add_container_with_type(type: string, items: string[], x: number, y: number, data?: string): void {
    if (!this.view) {
      return;
    }
    const container: ContainerInterface = {
      id_container: '',
      id_view: this.view.id_view,
      type: type,
      x: x,
      y: y,
      z: 0,
      width: 16,
      height: 12,
      item_ids: items,
      data: data
    };
    console.log(container);
    this.nakiService.create_container(this.view.id_view, container).then((res: APIResponse<ContainerInterface>) => {
      if (!this.view || !res.data) {
        return;
      }
      if (!this.view.containers) {
        this.view.containers = [];
      }
      this.view.containers.push(res.data);
      this.newItemSubjects.set(res.data.id_container, new Subject<string>());
      this.viewSubjects.set(res.data.id_container, new Subject<ContainerEventInterface>());
    });
  }
  public remove_container(index: number) {
    console.log(index);
    // const c = this.containers.findIndex(e => e === container);
    if (this.view === undefined || this.view.containers === undefined) {
      return;
    }
    if (index >= 0) {
      const removed = this.view.containers.splice(index, 1);
      this.nakiService.delete_container(this.view.id_view, removed[0].id_container).then(res => {
        console.log('deleted, ' + res.toString());
        this.newItemSubjects.delete(removed[0].id_container);
        this.viewSubjects.delete(removed[0].id_container);
      });
    }

  }

  public filter_items(items: DigitalItem[], path: string) {
    return items.filter((item: DigitalItem) =>
      (!item.path && !path) || (item.path === path)
    );
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      console.log(params);
      this.nakiService.get_view(params['id']).then((res: APIResponse<ViewInterface>) => {
        this.view = res.data;
        if (this.view === undefined) {
          return;
        }
        if (this.view.items === undefined) {
          this.view.items = [];
        }
        this.view.items.forEach(item => {
          if (item.path) {
            this.add_prefix(item.path);
          }
          // if (item.path && this.prefixes.indexOf(item.path) === -1) {
          //   this.prefixes.push(item.path);
          // }
        });
        if (this.view.containers === undefined) {
          this.view.containers = [];
        }
        for (const cont of this.view.containers) {
          this.newItemSubjects.set(cont.id_container, new Subject<string>());
          this.viewSubjects.set(cont.id_container, new Subject<ContainerEventInterface>());
        }
      });
    });
    // this.containers.push(this.nakiService.generate_container('image'));
  }

  public dropItem(event: DropEvent): void {
    console.log(event);
    const dre: DragEvent = event.nativeEvent as DragEvent;
    const x = Math.floor(dre.offsetX / NakiConfig.cellWidth);
    const y = Math.floor(dre.offsetY / NakiConfig.cellHeight);
    console.log('Creating container at ' + x.toString(10) + ', ' + y.toString(10));

    if (event.dragData.prefix && this.view !== undefined && this.view.items !== undefined) {
      const items = this.filter_items(this.view.items, event.dragData.prefix);
      if (items.length > 0) {
        this.add_container(items, x, y);
      }
    } else {
      this.add_container(event.dragData, x, y);
    }


  }

  public dropItem2(event: DropEvent, container: ContainerInterface): boolean {
    console.log(event);
    if (this.newItemSubjects) {
      const subject: Subject<string> | undefined = this.newItemSubjects.get(container.id_container);
      if (subject !== undefined) {
        subject.next(event.dragData.id_item);
      }
    }
    return false;
  }

  public printe(what: string, event: any): void {
    console.log(what);
    console.log(event);
  }

  public add_item(multi: boolean = false): void {
    if (this.view === undefined) {
      return;
    }
    const dialogRef = this.dialog.open(FindItemDialogComponent, {width: '100%', panelClass: 'centered-dialog', data: {multiple: multi}});
    if (!this.view.items) {
      this.view.items = [];
    }
    if (!multi) {
      dialogRef.afterClosed().subscribe((ret: string) => this.add_item_to_view(ret));
    } else {
      dialogRef.afterClosed().subscribe((ret: string[]) => {
        if (ret) {
          ret.map((e: string) => this.add_item_to_view(e));
        }
      });
    }
  }

  public remove_item(item: DigitalItem): void {
    if (this.view === undefined) {
      return;
    }
    this.nakiService.remove_item_from_view(this.view.id_view, item.id_item).then(() => {
      if (this.view === undefined || this.view.items === undefined) {
        return;
      }
      const idx = this.view.items.findIndex(e => e.id_item === item.id_item);
      if (idx >= 0) {
        const path = item.path;
        this.view.items.splice(idx, 1);
        this.remove_path_if_unused(path);
      }
    });
  }

  public add_group(): void {
    const dialogRef = this.dialog.open(FindGroupDialogComponent, {width: '100%', panelClass: 'centered-dialog', data: {}});
    dialogRef.afterClosed().subscribe((res: DigitalGroup) => {
      console.log(res);
      if (!res) {
        return;
      }
      this.nakiService.get_group(res.id_group).then((grp: APIResponse<DigitalGroup>) => {
        console.log(grp);
        if (grp.data !== undefined && grp.data.items !== undefined) {
          grp.data.items.forEach((item: DigitalItem) => {
            if (grp.data !== undefined) {
              this.add_item_to_view(item.id_item, this.get_metadata(grp.data, 'description') || grp.data.id_group);
            }
          });
        }
      });
    });
  }

  public remove_group(prefix: string) {
    if (this.view === undefined || this.view.items === undefined) {
      return;
    }
    const items = this.filter_items(this.view.items, prefix);
    items.forEach(e => this.remove_item(e));
  }

  public open_menu(event: any, data: DigitalItem, data2: any): boolean {
    console.log(event, data, data2);
    return false;
  }

  public move_item_to_a_group(item: DigitalItem | null, prefix: string): void {
    if (!item) {
      // No item specified, let's move all seleced items
      this.selected_items.forEach(e => this.move_item_to_a_group(e, prefix));
      return;
    }
    if (item.path === prefix) {
      return;
    }
    const old_path = item.path;
    this.add_prefix(prefix);

    item.path = prefix;
    if (this.view !== undefined) {
      this.nakiService.add_item_to_view(this.view.id_view, item.id_item, prefix);
    }
    this.remove_path_if_unused(old_path);
  }

  public remove_path_if_unused(path: string | undefined): void {
    if (this.view === undefined || this.view.items === undefined) {
      return;
    }
    if (path && this.view.items.findIndex(e => e.path === path) === -1) {
      this.prefixes.splice(this.prefixes.indexOf(path), 1);
    }
  }

  public drop_to_a_group(prefix: string, event: DropEvent): void {
    const item: DigitalItem = event.dragData as DigitalItem;
    this.move_item_to_a_group(item, prefix);
  }

  public rename_group(old_prefix: string, new_prefix: string): boolean {
    // console.log(old_prefix, new_prefix);
    if (this.prefixes.indexOf(new_prefix) !== -1) {
      return false;
    } else {
      if (this.view === undefined || this.view.items === undefined) {
        return false;
      }
      this.filter_items(this.view.items, old_prefix).forEach(e => this.move_item_to_a_group(e, new_prefix));
      // this.prefixes.push(new_prefix);
      console.log(this.view.items, this.prefixes);
      // this.remove_path_if_unused(old_prefix);
    }
    return false;

  }

  public open_ctx_menu(trigger: MatMenuTrigger, event: MouseEvent): boolean {
    if (event.ctrlKey && event.altKey) {
      return true;
    }
    trigger.openMenu();
    event.preventDefault();
    event.stopPropagation();
    return false;
  }

  public selecting_start(event: MatSlideToggleChange): void {
    this.selecting_items = event.checked;
    this.selected_items = [];
  }

  public delete_selected(): void {
    this.selected_items.forEach((e: DigitalItem) => this.remove_item(e));
    this.selected_items = [];
  }

  public select_item(item: DigitalItem, event: MatCheckboxChange): void {
    const idx = this.selected_items.findIndex(e => e.id_item === item.id_item);
    if (event.checked) {
      if (idx === -1) {
        this.selected_items.push(item);
      }
    } else if (idx !== -1) {
      this.selected_items.splice(idx, 1);
    }
  }

  public is_selected(item: DigitalItem): boolean {
    return this.selected_items.findIndex(e => e.id_item === item.id_item) !== -1;
  }

  public save_group(prefix: string): void {
    const dialogRef = this.dialog.open(EditGroupDialogComponent, {data: {group_id: null}});
    dialogRef.afterClosed().subscribe((group) => {
      if (group && this.view && this.view.items) {
        Promise.all(this.filter_items(this.view.items, prefix).map(e => this.nakiService.add_item_to_group(group.id_group, e.id_item)))
          .then((res: APIResponse<DigitalItem>[]) => {
            console.log(res);
          });
      }
    });
  }

  private add_item_to_view(item_id: string, path?: string): void {
    if (this.view === undefined || this.view.items === undefined) {
      return;
    }
    if (item_id && this.view.items.findIndex(e => e.id_item === item_id) < 0) {
      console.log('Adding ' + item_id);
      console.log(this.view.items);
      this.nakiService.add_item_to_view(this.view.id_view, item_id, path).then(res => {
        console.log(res);
        if (res.data !== undefined) {
          res.data.path = path;
          this.add_prefix(path);
          if (this.view !== undefined && this.view.items !== undefined) {
            this.view.items.push(res.data);
            console.log(this.view.items);
          }
        }
      });
    }
  }

  private add_prefix(path: string | undefined): void {
    if (path && this.prefixes.indexOf(path) === -1) {
      this.prefixes.push(path);
      this.prefixes.sort((a, b) => a > b ? 1 : a < b ? -1 : 0);
    }
  }

  public newState(event: ContainerEventInterface): void {
    console.log('newState: ', event);
    if (!this.view || !this.view.containers) {
      return;
    }
    this.eventCache.set(event.id_container, event);
    for (const container of this.view.containers) {
      if (container.id_container !== event.id_container) {
        const eventSub = this.viewSubjects.get(container.id_container);
        if (eventSub) {
          console.log('sending to ' + container.id_container);
          eventSub.next(event);
        }
      }
    }
  }

  public create_annotation_container(remote_container: string): void {
    this.add_container_with_type('annotation', [], 0, 0, JSON.stringify({'id_container': remote_container}));
  }


}
