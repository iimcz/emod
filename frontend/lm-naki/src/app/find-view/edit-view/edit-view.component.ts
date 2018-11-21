import {Component, Input, OnInit} from '@angular/core';
import {MetakeyInterface} from '../../interface/metakey.interface';
import {ViewInterface} from '../../interface/view.interface';
import {NakiService} from '../../naki.service';
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-edit-view',
  templateUrl: './edit-view.component.html',
  styleUrls: ['./edit-view.component.css'],
  exportAs: 'EditViewComponent'
})
export class EditViewComponent implements OnInit {
  @Input() view: ViewInterface | undefined | null;
  @Input() metakeys: MetakeyInterface[] = [];

  constructor(public nakiService: NakiService) {
  }

  ngOnInit() {
    if (!this.view) {
      const uinfo = this.nakiService.get_user_info();
      const user = uinfo ? uinfo.id_user : '';
      this.view = {
        id_view: '',
        created: '',
        id_user: user,
        metadata: []
      };
    }
  }

  public save(dialogRef: MatDialogRef<any>): void {
    console.log(this.view);
    if (!this.view) {
      return;
    }
    const req = this.view.id_view ? this.nakiService.update_view(this.view) : this.nakiService.create_view(this.view);
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
