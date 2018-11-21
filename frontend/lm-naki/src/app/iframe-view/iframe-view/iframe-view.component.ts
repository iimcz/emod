import {Component, Input, OnInit, SecurityContext} from '@angular/core';
import {DigitalItem} from '../../interface/digital-item';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {NakiService} from '../../naki.service';
import {LinkInterface} from '../../interface/link.interface';

@Component({
  selector: 'app-iframe-view',
  templateUrl: './iframe-view.component.html',
  styleUrls: ['./iframe-view.component.css']
})
export class IframeViewComponent implements OnInit {
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

  public get_url(): SafeResourceUrl {
    if (this.dis && this.dis.length > 0 && this.dis[0].links  !== undefined && (<LinkInterface[]>this.dis[0].links).length > 0) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(this.nakiService.get_resource_url((<LinkInterface[]>this.dis[0].links)[0].uri));
    } else {
      return '';
    }
  }

}
