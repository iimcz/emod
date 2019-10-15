import {
  ApplicationRef,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  ElementRef,
  EmbeddedViewRef, EventEmitter, Injector, Input, OnDestroy,
  OnInit, Output,
  ViewChild
} from '@angular/core';
import {NakiService} from '../../naki.service';
import {DigitalItem} from '../../interface/digital-item';
import {NakiDefaultPlayerService} from '../../naki-default-player.service';
import {Subscription} from 'rxjs';
import {ContainerEventInterface} from '../../interface/container-event.interface';

@Component({
  selector: 'app-item-player',
  templateUrl: './item-player.component.html',
  styleUrls: ['./item-player.component.css'],
  exportAs: 'ItemPlayerComponent'
})
export class ItemPlayerComponent implements OnInit, OnDestroy {

  @ViewChild('innerContent', { static: true }) innerContent: ElementRef | undefined;
  @Output() stateUpdate: EventEmitter<ContainerEventInterface> = new EventEmitter<ContainerEventInterface>();
  @Input() view_id: string | undefined;
  private componentRef: ComponentRef<any> | undefined;
  private componentUpdateRef: Subscription | undefined;
  private componentEventRef: Subscription | undefined;
  private _type = 'image';

  get type() {
    return this._type;
  }

  private _mode = 'edit';
  get mode() {
    return this._mode;
  }

  // Modes should be either 'edit' or 'play'
  @Input() set mode(value: string) {
    this._mode = value;
    if (this.componentRef) {
      this.componentRef.instance.play_mode = this._mode === 'play';
    }
  }

  @Input() set type(value: string) {
    if (this._type !== value) {
      this._type = value;
      // Using timeout, so we don't change DOM during update
      setTimeout(() => {
        this.create_view();
      }, 0);
    }
  }
  private dis_: DigitalItem[] = [];
  @Input() get dis() {
    return this.dis_;
  }

  set dis(items: DigitalItem[]) {
    this.dis_ = items;
    setTimeout(() => {
      this.create_view();
    }, 0);
  }
  private data_ = '';
  @Input() get data() {
    return this.data_;
  }

  set data(d: string) {
    if (this.data_ !== d) {
      this.data_ = d;
      setTimeout(() => {
        this.create_view();
      }, 0);
    }
  }

  private size_: number[] = [];
  @Input() set size(size0: number[]) {
    this.size_ = size0;
    setTimeout(() => {
      if (this.componentRef) {
        this.componentRef.instance.size = size0;
      }
    }, 0);
  }
  get size() {
    return this.size_;
  }

  @Output() update: EventEmitter<any> = new EventEmitter<any>();
  constructor(private componentFactoryResolver: ComponentFactoryResolver,
              private appRef: ApplicationRef,
              private injector: Injector,
              private defaultPlayerService: NakiDefaultPlayerService,
              public nakiService: NakiService) { }

  ngOnInit() {
    setTimeout(() => {
      this.create_view();
    }, 0);
  }

  ngOnDestroy() {
    this.destroy_view();
  }


  private create_view(): void {
    this.destroy_view();
    // Inspired byt https://medium.com/@caroso1222/angular-pro-tip-how-to-dynamically-create-components-in-body-ba200cc289e6
    // console.log('Creating child');
    // console.log(ItemPlayerComponent.component_map);
    // const comp = ItemPlayerComponent.component_map.get(this.type);
    const comp = this.defaultPlayerService.getPlayerComponent(this.type);
    if (!comp) {
      console.log('Unknown type: ' + this.type);
      return;
    }

    this.componentRef = this.componentFactoryResolver
      .resolveComponentFactory(comp)
      .create(this.injector);

    // console.log(this.componentRef);
    this.componentRef.instance.dis = this.dis;
    this.componentRef.instance.play_mode = this.mode === 'play';
    this.componentRef.instance.data = this.data;
    this.componentRef.instance.size = this.size;
    this.componentRef.instance.view_id = this.view_id;

    if (this.componentRef.instance.update) {
      this.componentUpdateRef = (this.componentRef.instance.update as EventEmitter<string>).subscribe((value: string) => {
        this.data_ = value;
        this.update_container(value);
      });
    }
    if (this.componentRef.instance.stateUpdate) {
      this.componentEventRef = (this.componentRef.instance.stateUpdate as EventEmitter<ContainerEventInterface>).subscribe((value: ContainerEventInterface) => {
        this.stateUpdate.emit(value);
      });
    }


    this.appRef.attachView(this.componentRef.hostView);

    const domElem = (this.componentRef.hostView as EmbeddedViewRef<any>)
      .rootNodes[0] as HTMLElement;

    // console.log(domElem);
    if (!this.innerContent) {
      console.error('innerContent element missing');
      return;
    }
    const inner = this.innerContent.nativeElement as HTMLElement;
    // console.log(inner);
    inner.appendChild(domElem);
  }

  private destroy_view() {
    if (this.componentRef) {
      // console.log('Destroyin child');
      this.appRef.detachView(this.componentRef.hostView);
      this.componentRef.destroy();
    }
    if (this.componentUpdateRef) {
      this.componentUpdateRef.unsubscribe();
      this.componentUpdateRef = undefined;
    }
    if (this.componentEventRef) {
      this.componentEventRef.unsubscribe();
      this.componentEventRef = undefined;
    }
    this.componentRef = undefined;
  }
  private update_container(value: string): void {
    console.log('Update');
    console.log(value);
    this.update.emit(value);
  }
  public set_focus(): void {
    if (this.componentRef && this.componentRef.instance && this.componentRef.instance.focus) {
      this.componentRef.instance.focus();
    }
    // if (this.componentRef)
    // console.log(this.innerContent);
    // this.innerContent.nativeElement.firstChild.focus();
    // console.log(document.activeElement);
  }

  public receiveEvent(event: ContainerEventInterface): void {
    if (this.componentRef && this.componentRef.instance.receiveEvent) {
      this.componentRef.instance.receiveEvent(event);
    }
  }

  public annotate(): void {
    if (this.componentRef && this.componentRef.instance.annotate) {
      this.componentRef.instance.annotate();
    }
  }
}


