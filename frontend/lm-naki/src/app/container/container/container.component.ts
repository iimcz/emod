import {DigitalItem} from '../../interface/digital-item';
import {
  ApplicationRef,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  ElementRef, EmbeddedViewRef, EventEmitter,
  Injector,
  Input, OnDestroy,
  OnInit, Output,
  ViewChild
} from '@angular/core';
import {NakiService} from '../../naki.service';
import {NakiConfig} from '../../config';
import {AngularDraggableDirective, AngularResizableDirective, IPosition} from 'angular2-draggable';
import {IResizeEvent} from 'angular2-draggable/lib/models/resize-event';
import {ContainerInterface} from '../../interface/container.interface';
import {NakiDefaultPlayerService} from '../../naki-default-player.service';
import {APIResponse} from '../../apiresponse.interface';
import {Subject, Subscription} from 'rxjs';
import {ItemPlayerComponent} from '../item-player/item-player.component';
import {Utils} from '../../naki.utils';
import {MatMenuTrigger} from '@angular/material';
import {ContainerEventInterface} from '../../interface/container-event.interface';
import {ViewComponent} from '../../view/view/view.component';



@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})
export class ContainerComponent implements OnInit, OnDestroy {


  @Input() container_id = '';
  @Input() view_id = '';
  @Input() index = 0;
  @Input() viewCanvas: ElementRef | undefined;
  @Input() readonly = false;
  @Output() deleteRequest: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() stateUpdate: EventEmitter<ContainerEventInterface> = new EventEmitter<ContainerEventInterface>();
  @Input() new_items: Subject<string> | undefined;
  @Input() events: Subject<ContainerEventInterface> | undefined;
  @Input() viewManager: ViewComponent | undefined;
  @ViewChild('topDraggable') topDraggable: AngularDraggableDirective | undefined;
  @ViewChild('topResizable') topResizable: AngularResizableDirective | undefined;
  @ViewChild('topElement') topElement: ElementRef | undefined;
  @ViewChild('itemPlayer') itemPlayer: ItemPlayerComponent | undefined;

  public dis: DigitalItem[] = [];
  public nakiConfig = NakiConfig;
  public container: ContainerInterface | undefined;
  private new_items_sub: Subscription | undefined;
  private event_sub: Subscription | undefined;
  public get_metadata = Utils.get_metadata;

  constructor(public defaultPlayerService: NakiDefaultPlayerService,
              public nakiService: NakiService) {
  }


  @Input() mode = 'play';


  ngOnInit() {
    this.loadItems();
    if (this.new_items) {
      this.new_items_sub = this.new_items.subscribe((value: string) => {
        if (!this.container) {
          console.error('Adding items to an empty container');
          return;
        }
        console.log('Adding ' + value);
        this.nakiService.add_item_to_container(this.container.id_view, this.container.id_container, value).then(() => {
          this.loadItems();
        });
      });
    }
    if (this.events) {
      this.event_sub = this.events.subscribe((value: ContainerEventInterface) => {
        this.receiveContainerEvent(value);
      })
    }
    // this.init();
  }

  ngOnDestroy() {
    // this.destroy_view();
    if (this.new_items_sub) {
      this.new_items_sub.unsubscribe();
    }
    if (this.event_sub) {
      this.event_sub.unsubscribe();
    }
  }

  public init(): void {
    // console.log(this.topElement);
    // console.log(this.topResizable);
    // console.log(this.topDraggable);

    if (this.topElement && this.topElement.nativeElement && this.container) {
      const style = this.topElement.nativeElement.style;
      style.width = this.nakiConfig.widthToPxStr(this.container.width);
      style.height = this.nakiConfig.heightToPxStr(this.container.height);
    } else {
      console.log('Not initialized');
    }
  }

  public update_position(position: IPosition): void {
    // console.log(position);
    console.log(this.position_to_grid(position.x, this.nakiConfig.cellWidth), this.position_to_grid(position.y, this.nakiConfig.cellWidth));
    // console.log(this.topElement.nativeElement.style.transform);
    const new_x = Math.round(position.x / this.nakiConfig.cellWidth);
    const new_y = Math.round(position.y / this.nakiConfig.cellHeight);
    if (this.container && (this.container.x !== new_x || this.container.y !== new_y)) {
      this.container.x = new_x;
      this.container.y = new_y;
      this.save_container();
    }
  }

  public update_size(event: IResizeEvent): void {
    console.log('New size ' + event.size.width + 'x' + event.size.height);

    // TODO: save new size (event.size.width, event.size.height)
    if (this.container) {
      this.container.width = Math.round(event.size.width / this.nakiConfig.cellWidth);
      this.container.height = Math.round(event.size.height / this.nakiConfig.cellHeight);
    }
    this.save_container();
  }

  private save_container(): void {
    if (this.readonly || !this.container) {
      return;
    }
    this.nakiService.update_container(this.view_id, this.container).then(res => {
      console.log('Updated');
      console.log(res);
    });
  }
  public loadItems(): Promise<boolean> {
    if (!this.container_id) {
      return new Promise<boolean>(resolve => {
        return false;
      });
    }

    return this.nakiService.get_container(this.view_id, this.container_id).then((container: APIResponse<ContainerInterface>) => {
      this.container = container.data;
      if (!this.container) {
        console.error('No data received');
        return false;
      }
      // this.type = this.container.type;
      return Promise.all(this.container.item_ids.map((item_id: string) => {
        return this.nakiService.get_item(item_id);
      })).then(e => e.map(x => x.data), () => null).then((items: (DigitalItem | undefined)[] | null) => {

        console.log(items);
        if (!items) {
          return false;
        }
        this.dis = items.filter((val: DigitalItem | undefined): boolean => val !== undefined) as DigitalItem[];
        // this.create_view();
        this.init();
        return true;
      }, () => false);
    });
  }

  public print_event(name: any, event: any): void {
    console.log(name);
    console.log(event);
  }



  private position_to_grid(pos: number, gridSize: number) {
    return Math.round(pos / gridSize) * gridSize;
  }

  public set_type(type: string): void {
    if (!this.container) {
      return;
    }
    this.container.type = type;
    this.save_container();
  }

  public update_z(z: number): void {
    if (!this.container) {
      return;
    }
    // We don't want negative values, container would disappear... ;)
    this.container.z += z;
    if (this.container.z < 0) {
      this.container.z = 0;
    }
    this.save_container();
  }
  public remove_di(di: DigitalItem): void {
    if (!this.container) {
      return;
    }
    console.log('Removing');
    console.log(di);
    this.nakiService.remove_item_from_container(this.container.id_view, this.container.id_container, di.id_item).then(() => {
      const idx = this.dis.findIndex(e => e.id_item === di.id_item);
      if (idx >= 0) {
        this.dis.splice(idx, 1);
      }
    });
  }
  public update_data(data: string): void {
    if (!this.container) {
      return;
    }
    console.log('Updating data');
    console.log(data);
    if (this.container.data !== data) {
      this.container.data = data;
      this.save_container();
    }
  }
  public set_focus(event: any, element: HTMLElement) {
    // console.log(event, element);
    element.focus();
    // console.log(document.activeElement);
  }
  public click_menu(event: MouseEvent, trigger: MatMenuTrigger): boolean {
    console.log(event);
    if (event.ctrlKey) {
      trigger.openMenu();
      return false;
    }
    return true;
  }

  public key(what: string, key: any): boolean {
    console.log(what, key);
    return true;
  }
  public updateState(event: ContainerEventInterface): void {
    event.id_container = this.container_id;
    this.stateUpdate.emit(event);
  }
  public receiveContainerEvent(event: ContainerEventInterface): void {
    console.log(event);
    if (this.itemPlayer) {
      this.itemPlayer.receiveEvent(event);
    }
  }

}



