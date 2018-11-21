import {Component, OnInit} from '@angular/core';
import {NakiService} from '../../naki.service';
import {Rights} from '../../rights.enum';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  public rights = Rights;
  constructor(public nakiService: NakiService) {
  }

  ngOnInit() {
  }

}
