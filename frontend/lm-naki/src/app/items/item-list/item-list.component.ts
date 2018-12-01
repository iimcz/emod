import {Component, OnInit} from '@angular/core';
import {NakiService} from '../../naki.service';
import {Rights} from '../../rights.enum';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnInit {
  constructor(public nakiService: NakiService) {
  }

  ngOnInit() {
  }

  public can_edit(): boolean {
    return this.nakiService.has_right(Rights.Editor);
  }
}
