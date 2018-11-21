import {Component, Inject, OnInit} from '@angular/core';
import {UserInterface} from '../../interface/user.interface';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {NakiService} from '../../naki.service';
import {APIResponse} from '../../apiresponse.interface';

@Component({
  selector: 'app-edit-user-dialog',
  templateUrl: './edit-user-dialog.component.html',
  styleUrls: ['./edit-user-dialog.component.css']
})
export class EditUserDialogComponent implements OnInit {
  public user: UserInterface| undefined;
  constructor(public dialogRef: MatDialogRef<EditUserDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {user_id: string | undefined},
              public nakiService: NakiService) { }

  ngOnInit() {
    this.reloadData();
  }


  public reloadData(): void {
    console.log(this.data);
    if (this.data.user_id !== undefined) {
      this.nakiService.get_user(this.data.user_id).then((res: APIResponse<UserInterface>) => {
        if (res.data !== undefined) {
          this.user = res.data;
        }
      });
    }
  }
}
