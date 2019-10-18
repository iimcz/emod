import {Component, Input, OnInit} from '@angular/core';
import {DigitalItem} from '../../interface/digital-item';
import {NakiDefaultPlayerService} from '../../naki-default-player.service';
import {NakiService} from '../../naki.service';

@Component({
  selector: 'app-item-preview',
  templateUrl: './item-preview.component.html',
  styleUrls: ['./item-preview.component.css']
})
export class ItemPreviewComponent implements OnInit {
  @Input() item: DigitalItem | undefined;
  @Input() maxWidth = 128;
  @Input() maxHeight = 128;
  @Input() dummy = false;

  constructor(public defaultPlayer: NakiDefaultPlayerService,
              public nakiService: NakiService) {
  }

  ngOnInit() {
  }

}
