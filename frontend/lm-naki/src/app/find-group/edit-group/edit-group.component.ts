import {Component, Input, OnInit} from '@angular/core';
import {MetakeyInterface} from '../../interface/metakey.interface';
import {MetadataInterface} from '../../interface/metadata.interface';
import {NakiService} from '../../naki.service';
import {APIResponse} from '../../apiresponse.interface';
import { MatDialogRef } from '@angular/material/dialog';
import {DigitalGroup} from '../../interface/digital-group';

@Component({
  selector: 'app-edit-group',
  templateUrl: './edit-group.component.html',
  styleUrls: ['./edit-group.component.css'],
  exportAs: 'EditGroupComponent'
})
export class EditGroupComponent implements OnInit {
  metakeys: MetakeyInterface[] = [];
  @Input() group: DigitalGroup | undefined;

  constructor(private nakiService: NakiService) {
  }

  ngOnInit() {
    const uinfo = this.nakiService.get_user_info();
    const user = uinfo ? uinfo.id_user : '';
    if (!this.group) {
      this.group = {
        id_group: '',
        created: '',
        id_user: user,
        metadata: []
      };
    }
    if (!this.group.metadata) {
      this.group.metadata = [];
    }
    this.nakiService.get_metakey_list().then((res: APIResponse<MetakeyInterface[]>) => {
      if (res.data !== undefined) {
        this.metakeys = res.data;
      }
    });
  }

  public save_group(dialogRef: MatDialogRef<any>) {
    console.log(dialogRef);
    if (!this.group) {
      return;
    }
    if (this.group.id_group) {
      this.nakiService.update_group(this.group).then((res: APIResponse<DigitalGroup>) => {
        console.log(res);
        if (dialogRef) {
          dialogRef.close(res.data);
        }
      });
    } else {
      this.nakiService.create_group(this.group).then((res: APIResponse<DigitalGroup>) => {
        console.log(res);
        if (dialogRef) {
          dialogRef.close(res.data);
        }
      });
    }
  }
}
