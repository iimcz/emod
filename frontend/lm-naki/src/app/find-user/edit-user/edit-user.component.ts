import {Component, Input, OnInit} from '@angular/core';
import {UserInterface} from '../../interface/user.interface';
import { MatDialogRef } from '@angular/material/dialog';
import {Rights} from '../../rights.enum';
import {APIResponse} from '../../apiresponse.interface';
import {NakiService} from '../../naki.service';
import {Utils} from '../../naki.utils';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css'],
  exportAs: 'EditUserComponent'
})
export class EditUserComponent implements OnInit {
  @Input() user: UserInterface | undefined;
  public rights = Rights;
  public passwd1 = '';
  public passwd2 = '';

  constructor(public nakiService: NakiService) {
  }

  ngOnInit() {
    console.log(this.user);
    if (this.user === undefined) {
      console.log('undefined');
      this.user = {
        id_user: '',
        username: '',
        fullname: '',
        auth_level: Rights.Guest
      };
      console.log(this.user);
    }
  }

  public save_user(dialogRef?: MatDialogRef<any>): Promise<boolean> | undefined {
    console.log(dialogRef);
    console.log(this.user);
    if (this.user === undefined) {
      console.log('No user');
      return;
    }
    if (!this.user.id_user) {
      if (!this.passwd1) {
        alert('Passwrd has to be set');
        return;
      }
      if (this.passwd1 !== this.passwd2) {
        alert('Passwords do not match!');
        return;
      }
    }
    if (this.passwd1) {
      this.user.passwd = Utils.hash_pw(this.passwd1);
      console.log('Prepared pw hash ' + this.user.passwd);
    }
    console.log('Req');
    const promise: Promise<APIResponse<UserInterface>> = this.user.id_user ? this.nakiService.update_user(this.user) : this.nakiService.create_user(this.user);
    return promise.then((res) => {
      if (dialogRef) {
        dialogRef.close(res.data);
      }
      return !!res;
    });
  }

}
