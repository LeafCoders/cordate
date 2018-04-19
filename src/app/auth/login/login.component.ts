import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { environment } from '../../../environments/environment';
import { AuthService, UserIdentity } from '../auth.service';
import { AuthPermissionService } from '../auth-permission.service';
import { RestApiError } from "../../shared/server/rest-api-error.model";

interface PreviousUser {
  fullName: string;
  username: string;
};


@Component({
  selector: 'lc-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  applicationName: string = environment.applicationName;

  public selectedUser: PreviousUser;
  public previousUsers: Array<PreviousUser> = [];
  public showSelectUser: boolean = false;
  public errorMessage: string;
  public showForgottenPasswordInfo: boolean = false;

  public form: FormGroup;
  private usernameCtrl: FormControl = new FormControl('', Validators.required);
  private passwordCtrl: FormControl = new FormControl('', Validators.required);

  constructor(
    private authService: AuthService,
    private router: Router,
    authPermission: AuthPermissionService,
    builder: FormBuilder
  ) {
    this.form = builder.group({
      username: this.usernameCtrl,
      password: this.passwordCtrl
    });
    authPermission.clearPermissions();
    authService.logout();
  }

  ngOnInit() {
    let storedUsers: string = localStorage.getItem('previousUsers');
    this.previousUsers = storedUsers ? JSON.parse(storedUsers) : [];
    if (this.previousUsers.length > 0) {
      this.setUser(this.previousUsers[0]);
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
      this.passwordCtrl.setValue('');
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
