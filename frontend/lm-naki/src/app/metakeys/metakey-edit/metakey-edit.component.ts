import {Component, Input, OnInit} from '@angular/core';
import {MetakeyInterface} from '../../interface/metakey.interface';
import { MatDialogRef } from '@angular/material/dialog';
import {NakiService} from '../../naki.service';
import {APIResponse} from '../../apiresponse.interface';

@Component({
  selector: 'app-metakey-edit',
  templateUrl: './metakey-edit.component.html',
  styleUrls: ['./metakey-edit.component.css'],
  exportAs: 'MetakeyEditComponent'
})
export class MetakeyEditComponent implements OnInit {
  @Input() metakey: MetakeyInterface | undefined;
  public mandatory: string[] = [];
  constructor(public nakiService: NakiService) { }

  ngOnInit() {
    if (this.metakey) {
      this.mandatory = this.metakey.mandatory.split('');
    }
    console.log(this.mandatory);
  }

  save(dialogRef: MatDialogRef<any>): void {
    if (this.metakey !== undefined) {
      this.metakey.mandatory = this.mandatory.join('');
      this.nakiService.update_metakey(this.metakey).then((res: APIResponse<MetakeyInterface>) => {
        dialogRef.close(res.data);
      });
    }
  }

}
