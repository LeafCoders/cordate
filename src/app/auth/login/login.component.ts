import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { environment } from '../../../environments/environment';
import { AuthService } from '../auth.service';
import { AuthPermissionService } from '../auth-permission.service';
import { RestApiError } from "../../shared/server/rest-api-error.model";
import { UserIdentity } from '../../shared/current-user.service';

interface PreviousUser {
  fullName: string;
  username: string;
};


@Component({
  selector: 'lc-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  applicationName: string = environment.applicationName;

  selectedUser: PreviousUser;
  previousUsers: Array<PreviousUser> = [];
  showSelectUser: boolean = false;
  errorMessage: string;
  showForgottenPasswordInfo: boolean = false;

  form: FormGroup;
  usernameCtrl: FormControl = new FormControl('', Validators.required);
  passwordCtrl: FormControl = new FormControl('');

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    authPermission: AuthPermissionService,
  ) {
    this.form = new FormGroup({
      username: this.usernameCtrl,
      password: this.passwordCtrl
    });
    authPermission.clearPermissions();
    authService.logout();
  }

  ngOnInit() {
    let storedUsers: string = localStorage.getItem('previousUsers');
    this.previousUsers = storedUsers ? JSON.parse(storedUsers) : [];

    if (this.route.snapshot.queryParams.username) {
      this.usernameCtrl.setValue(this.route.snapshot.queryParams.username);
    } else {
      if (this.previousUsers.length > 0) {
        this.setUser(this.previousUsers[0]);
      }
    }
  }

  public setUser(user?: PreviousUser): void {
    setTimeout(() => {
      this.selectedUser = user;
      this.usernameCtrl.setValue(user ? user.username : '');
      this.showSelectUser = false;
    }, 1);
  }

  public login(): void {
    this.errorMessage = undefined;
    this.showForgottenPasswordInfo = false;
    if (!this.form.valid) {
      return;
    }
    let username: string = this.usernameCtrl.value;
    let password: string = this.passwordCtrl.value;
    this.authService.login(username, password).subscribe((userIdentity: UserIdentity) => {
      this.addToPreviousUsers({ fullName: userIdentity.fullName, username: username });
      this.router.navigateByUrl('/events');
    }, (error: RestApiError) => {
      this.errorMessage = error.getReason();
      this.showForgottenPasswordInfo = error.isInvalidPassword();
    });
  }

  private addToPreviousUsers(toStoreUser: PreviousUser): void {
    let index: number = this.previousUsers.findIndex(user => user.username === toStoreUser.username);
    if (index >= 0) {
      this.previousUsers.splice(index, 1);
    }
    localStorage.setItem('previousUsers', JSON.stringify([toStoreUser].concat(this.previousUsers)));
  }
}
