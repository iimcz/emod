import {DigitalItem} from './interface/digital-item';
import {ElementRef, Input, ViewChild} from '@angular/core';
import {NakiService} from './naki.service';
import {NakiConfig} from './config';
import {AngularDraggableDirective, AngularResizableDirective, IPosition} from 'angular2-draggable';
import {APIResponse} from './apiresponse.interface';

export abstract class GenericViewer {
  @Input() items: string[] = [];
  @Input() left = 0;
  @Input() top = 0;
  @Input() width = 2;
  @Input() height = 2;
  @Input() viewCanvas: ElementRef | undefined;

  @ViewChild('topDraggable') topDraggable: AngularDraggableDirective | undefined;
  @ViewChild('topResizable') topResizable: AngularResizableDirective | undefined;
  @ViewChild('topElement') topElement: ElementRef | undefined;

  public dis: DigitalItem[] = [];
  public nakiConfig = NakiConfig;

  constructor(public nakiService: NakiService) {

  }

  public init(): void {
    console.log(this.topElement);
    console.log(this.topResizable);
    console.log(this.topDraggable);

    if (this.topElement && this.topElement.nativeElement) {
      const style = this.topElement.nativeElement.style;
      style.width = this.nakiConfig.widthToPxStr(this.width);
      style.height = this.nakiConfig.heightToPxStr(this.height);
    } else {
      console.log('Not initialized');
    }
  }

  private position_to_grid(pos: number, gridSize: number) {
    return Math.round(pos / gridSize) * gridSize;
  }

  public update_position(position: IPosition) {
    console.log(position);
    console.log(this.position_to_grid(position.x, this.nakiConfig.cellWidth), this.position_to_grid(position.y, this.nakiConfig.cellWidth));

  }

  public abstract reloadData(): void;

  public loadItems(): Promise<boolean> {
    if (!this.items) {
      return new Promise<boolean>(resolve => {
        return false;
      });
    }

    return Promise.all(this.items.map((item_id: string) => {
      return this.nakiService.get_item(item_id);
    })).then(e => e, () => null).then((items: APIResponse<DigitalItem>[] | null) => {
      if (!items) {
        return false;
      }
      console.log(items);
      this.dis = items.map((item: APIResponse<DigitalItem>) => item.data).filter(e => e !== undefined) as DigitalItem[];
      return true;
    }, () => false);
  }

  public print_event(name: string, event: any): void {
    console.log(name);
    console.log(event);
  }
}
