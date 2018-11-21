import {Component, OnInit} from '@angular/core';
import {NakiService} from '../../naki.service';
import {UserInterface} from '../../interface/user.interface';
import {Router} from '@angular/router';
import {EditUserComponent} from '../../find-user/edit-user/edit-user.component';
import {APIResponse} from '../../apiresponse.interface';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  public user: UserInterface | undefined;
  constructor(private router: Router,
              public nakiService: NakiService) {
    this.user = nakiService.get_user_info();
    if (!this.user) {
      console.log('no user');
      router.navigate(['/home']);
    }
  }

  ngOnInit() {
  }
  public update(editUser: EditUserComponent): void {
    const p = editUser.save_user();
    if (p !== undefined) {
      p.then(() => {
        this.nakiService.ping().then((res: APIResponse<UserInterface>) => {
          if (res.data !== undefined) {
            console.log('Updating user');
            this.user = res.data;
          }
        });
      });
    }
  }
}
