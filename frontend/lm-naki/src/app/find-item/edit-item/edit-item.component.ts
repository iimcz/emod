import {Component, Input, OnInit} from '@angular/core';
import {DigitalItem} from '../../interface/digital-item';
import {NakiService} from '../../naki.service';
import {MetakeyInterface} from '../../interface/metakey.interface';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.css'],
  exportAs: 'EditItemComponent'
})
export class EditItemComponent implements OnInit {
  @Input() item: DigitalItem | undefined;
  @Input() metakeys: MetakeyInterface[] = [];

  constructor(public nakiService: NakiService) { }

  ngOnInit() {
  }

  public save(dialogRef: MatDialogRef<any>): void {
    console.log(this.item);
    if (this.item) {
      this.nakiService.update_item(this.item).then(() => {
        console.log('OK');
        if (dialogRef) {
          console.log('Closing dialog');
          dialogRef.close(true);
        }
      });
      console.log('SAVE');
    }
  }
}
