import {Component, OnInit} from '@angular/core';
import {NakiService} from '../../naki.service';
import {DigitalItem} from '../../interface/digital-item';
import {DomSanitizer} from '@angular/platform-browser';
import {LinkInterface} from '../../interface/link.interface';

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
}
