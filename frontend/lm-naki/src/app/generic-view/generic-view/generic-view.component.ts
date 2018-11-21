import {Component, Input, OnInit} from '@angular/core';
import {DigitalItem} from '../../interface/digital-item';
import {NakiService} from '../../naki.service';
import {Utils} from '../../naki.utils';

@Component({
  selector: 'app-generic-view',
  templateUrl: './generic-view.component.html',
  styleUrls: ['./generic-view.component.css']
})
export class GenericViewComponent implements OnInit {
  @Input() play_mode = false;
  @Input() dis: DigitalItem[] = [];

  public get_metadata = Utils.get_metadata;
  constructor(public nakiService: NakiService) {
  }

  ngOnInit() {
  }

}
