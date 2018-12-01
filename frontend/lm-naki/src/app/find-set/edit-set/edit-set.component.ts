import {Component, Input, OnInit} from '@angular/core';
import {MetakeyInterface} from '../../interface/metakey.interface';
import {DigitalSetInterface} from '../../interface/digital-set.interface';
import {NakiService} from '../../naki.service';
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-edit-set',
  templateUrl: './edit-set.component.html',
  styleUrls: ['./edit-set.component.css'],
  exportAs: 'EditSetComponent'
})
export class EditSetComponent implements OnInit {
  @Input() set: DigitalSetInterface | undefined | null;
  @Input() metakeys: MetakeyInterface[] = [];

  constructor(public nakiService: NakiService) {
  }


  ngOnInit() {
    if (!this.set) {
      const uinfo = this.nakiService.get_user_info();
      const user = uinfo ? uinfo.id_user : '';
      this.set = {
        id_set: '',
        created: '',
        id_user: user,
        author: uinfo,
        metadata: []
      };
    }
  }
  public save(dialogRef: MatDialogRef<any>): void {
    console.log(this.set);
    if (!this.set) {
      return;
    }
    const req = this.set.id_set ? this.nakiService.update_set(this.set) : this.nakiService.create_set(this.set);
    req.then(() => {
      console.log('OK');
      if (dialogRef) {
        console.log('Closing dialog');
        dialogRef.close(true);
      }
    });
    console.log('SAVE');
  }
}
