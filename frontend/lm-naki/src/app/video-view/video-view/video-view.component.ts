import {Component, Input, OnInit} from '@angular/core';
import {DigitalItem} from '../../interface/digital-item';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {NakiService} from '../../naki.service';
import {LinkInterface} from '../../interface/link.interface';

@Component({
  selector: 'app-video-view',
  templateUrl: './video-view.component.html',
  styleUrls: ['./video-view.component.css']
})
export class VideoViewComponent implements OnInit {

  @Input() play_mode = false;
  @Input() dis: DigitalItem[] = [];

  public url: SafeResourceUrl | undefined;

  constructor(private sanitizer: DomSanitizer,
              public nakiService: NakiService) {

  }

  ngOnInit() {
    this.url = this.get_url();
    console.log(this.url);
  }

  public get_url(): SafeResourceUrl | undefined {
    if (this.dis && this.dis.length > 0 && this.dis[0].links && (<LinkInterface[]>this.dis[0].links).length > 0) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(this.nakiService.get_resource_url((<LinkInterface[]>this.dis[0].links)[0].uri));
    } else {
      return undefined;
    }
  }

}
