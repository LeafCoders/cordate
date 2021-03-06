import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { AuthService } from '../auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';
//import { FormValidators } from '../../shared';

@Component({
  selector: 'lc-forgotten',
  templateUrl: './forgotten.component.html',
  styleUrls: ['./forgotten.component.scss']
})
export class ForgottenComponent {

  token: string;
  tokenHasExpired: boolean = false;
  userOfToken: string;

  notSent: boolean = true;
  sending: boolean = false;
  success: boolean = false;
  errorMessage: string;
  formSend: FormGroup;
  formApply: FormGroup;
  emailCtrl: FormControl = new FormControl('', Validators.compose([Validators.required, Validators.email]));
  passwordCtrl: FormControl = new FormControl('', Validators.required);

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    jwtHelperService: JwtHelperService,
  ) {
    this.token = this.route.snapshot.queryParams.token;

    if (this.token) {
      this.userOfToken = jwtHelperService.decodeToken(this.token).sub;
      this.tokenHasExpired = jwtHelperService.isTokenExpired(this.token);
    }

    this.formSend = new FormGroup({
      email: this.emailCtrl
    });
    this.formApply = new FormGroup({
      password: this.passwordCtrl
    });
  }

  public send(): void {
    if (!this.formSend.valid) {
      return;
    }
    this.errorMessage = undefined;
    this.notSent = false;
    this.sending = true;
    this.formSend.disable();
    let email: string = this.emailCtrl.value;
    this.authService.createForgottenPassword(email).subscribe(() => {
      this.sending = false;
      this.success = true;
      this.formSend.enable();
    });
  }

  public apply(): void {
    if (!this.formApply.valid) {
      return;
    }
    this.notSent = false;
    this.sending = true;
    this.formApply.disable();
    let password: string = this.passwordCtrl.value;
    this.authService.applyForgottenPassword(this.token, password).subscribe((success: boolean) => {
      this.sending = false;
      if (success) {
        this.success = true;
      } else {
        this.passwordCtrl.setValue('');
        this.notSent = true;
        this.errorMessage = 'Misslyckades att ändra lösenord. Försök igen.';
        this.formApply.enable();
      }
    });
  }
}
