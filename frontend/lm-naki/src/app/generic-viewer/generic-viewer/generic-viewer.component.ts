import {Component, Input, OnInit} from '@angular/core';
import {DigitalItem} from '../../interface/digital-item';
import {NakiService} from '../../naki.service';
import {Utils} from '../../naki.utils';

@Component({
  selector: 'app-generic-view',
  templateUrl: './generic-viewer.component.html',
  styleUrls: ['./generic-viewer.component.css']
})
export class GenericViewerComponent implements OnInit {
  @Input() play_mode = false;
  @Input() dis: DigitalItem[] = [];

  public get_metadata = Utils.get_metadata;
  constructor(public nakiService: NakiService) {
  }

  ngOnInit() {
  }

}
