import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {DigitalItem} from '../../interface/digital-item';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {NakiService} from '../../naki.service';
import {LinkInterface} from '../../interface/link.interface';
import {ContainerEventInterface} from '../../interface/container-event.interface';
import {ContentViewer} from '../../content-viewer';
import {AnnotationInterface} from '../../interface/annotation.interface';
import {MatDialog} from '@angular/material';

@Component({
  selector: 'app-video-viewer',
  templateUrl: './video-viewer.component.html',
  styleUrls: ['./video-viewer.component.css']
})
export class VideoViewerComponent extends ContentViewer implements OnInit {

  @ViewChild('videoElement') videoElement: ElementRef<HTMLVideoElement> | undefined;
  public url: SafeResourceUrl | undefined;

  constructor(protected sanitizer: DomSanitizer,
              protected dialog: MatDialog,
              public nakiService: NakiService) {
    super(sanitizer, dialog, nakiService);
  }

  ngOnInit() {
    this.url = this.get_url(0);
    console.log(this.url);
    this.emitState();
  }

  public timeupdate(event: Event): void {
    this.emitState();
  }

  private get_current_time(): number {
    return this.videoElement !== undefined ? this.videoElement.nativeElement.currentTime : 0;
  }

  protected prepare_state(): ContainerEventInterface | undefined {
    console.log(this.videoElement);
    if (this.dis && this.dis.length > 0) {
      return {
        id_container: '',
        id_item: this.dis[0].id_item,
        item_index: 0,
        item_time: this.get_current_time()
      };
    }
  }

  protected annotation_info(): AnnotationInterface | undefined {
    if (!this.dis || this.dis.length < 1) {
      return undefined;
    }
    return {
      id_item: this.dis[0].id_item,
      uri: '',
      time: this.get_current_time()
    };
  }
}
