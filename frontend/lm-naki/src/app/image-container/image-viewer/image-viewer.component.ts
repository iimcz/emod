import {Component, ElementRef, Input, OnInit, ViewChild, AfterViewInit, EventEmitter, Output, OnDestroy} from '@angular/core';
import {NakiService} from '../../naki.service';
import {DigitalItem} from '../../interface/digital-item';
import {DomSanitizer} from '@angular/platform-browser';
import {Observable, Subscription} from 'rxjs';

@Component({
  selector: 'app-image-viewer',
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.css']
})
export class ImageViewerComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() dis: DigitalItem[] = [];
  @Input() data: string | undefined;
  @Input() play_mode = false;
  @Output() update: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild('topDiv') topDiv: ElementRef | undefined;
  private index_ = 0;
  private event_sub: Subscription | undefined;

  constructor(private sanitizer: DomSanitizer,
              public nakiService: NakiService) {

  }

  public get index() {
    return this.index_;
  }

  public set index(val: number) {
    this.index_ = val;
    if (this.index_ < 0) {
      this.index_ = this.dis ? this.dis.length - 1 : 0;
    }
    if (this.dis && this.dis.length > 0 && this.index_ >= this.dis.length) {
      this.index_ = 0;
    }
    setTimeout(() => {
      this.update.emit(JSON.stringify({index: this.index_}));
    }, 0);
  }

  ngOnInit() {
    console.log('Initializing');
    this.dis.forEach((di: DigitalItem) => {
      if (di.links && di.links[0]) {
        di.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.nakiService.get_resource_url(di.links[0].uri));
      }
    });
    if (this.data) {
      const obj = JSON.parse(this.data);
      this.index = obj.index || 0;
    }
    if (this.dis && this.dis.length > 0 && this.index >= this.dis.length) {
      this.index = 0;
    }
    if (this.topDiv === undefined) {
      console.error ('topDiv not defined');
    } else {
      this.event_sub = Observable
        .fromEvent(this.topDiv.nativeElement, 'keyup')
        .debounceTime(150)
        .distinctUntilChanged()
        .subscribe((event0: {}) => {
          const event = event0 as KeyboardEvent;
          console.log(event);
          if (event.key === 'ArrowLeft') {
            --this.index;
          } else if (event.key === 'ArrowRight') {
            ++this.index;
          } else {
            return;
          }
          event.stopPropagation();
          event.preventDefault();
          event.cancelBubble = true;
        });
    }
  }
  public ngOnDestroy(): void {
    if (this.event_sub) {
      this.event_sub.unsubscribe();
    }
  }
  ngAfterViewInit() {

  }
  public focus(): void {
    console.log(document.activeElement);
    if (this.topDiv) {
      this.topDiv.nativeElement.focus();
    }
    console.log(document.activeElement);
  }
}
