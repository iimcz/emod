import {Component, OnDestroy, OnInit} from '@angular/core';
import {NakiService} from '../../naki.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {Utils} from '../../naki.utils';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  public username = '';
  public pw = '';
  private subscription: Subscription;
  constructor(private route: ActivatedRoute,
              private router: Router,
              public nakiService: NakiService) {
    this.subscription = this.route.data.subscribe((data: {logout?: boolean}) => {
      if (data && data.logout) {
        console.log('logging out');
        this.nakiService.logout().then(() => {
          this.router.navigate(['/home']);
        });
      }
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
      this.subscription.unsubscribe();
  }
  public login() {
    const pw_hash = Utils.hash_pw(this.pw);
    this.nakiService.login(this.username, pw_hash).then((res) => {
      console.log(res);
      this.router.navigate(['/home']);
    });
  }


}
