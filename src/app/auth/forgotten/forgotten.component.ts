import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { AuthService } from '../auth.service';
//import { FormValidators } from '../../shared';

@Component({
  selector: 'lc-forgotten',
  templateUrl: './forgotten.component.html',
  styleUrls: ['./forgotten.component.scss']
})
export class ForgottenComponent implements OnInit {

  public token: string;
  public notSent: boolean = true;
  public sending: boolean = false;
  public success: boolean = false;
  public errorMessage: string;
  public formSend: FormGroup;
  public formApply: FormGroup;
  private emailCtrl: FormControl = new FormControl('', Validators.compose([Validators.required])); //, FormValidators.email]));
  private passwordCtrl: FormControl = new FormControl('', Validators.required);

  constructor(
    private authService: AuthService,
    route: ActivatedRoute,
    builder: FormBuilder
  ) {
    this.token = route.snapshot.params['token'];

    this.formSend = builder.group({
      email: this.emailCtrl
    });
    this.formApply = builder.group({
      password: this.passwordCtrl
    });
  }

  ngOnInit() {
  }

  public send(): void {
    if (!this.formSend.valid) {
      return;
    }
    this.errorMessage = undefined;
    this.notSent = false;
    this.sending = true;
    let email: string = this.emailCtrl.value;
    this.authService.createForgottenPassword(email).subscribe(() => {
      this.sending = false;
      this.success = true;
    });
  }

  public apply(): void {
    if (!this.formApply.valid) {
      return;
    }
    this.notSent = false;
    this.sending = true;
    let password: string = this.passwordCtrl.value;
    this.authService.applyForgottenPassword(this.token, password).subscribe((success: boolean) => {
      this.sending = false;
      if (success) {
        this.success = true;
      } else {
        this.passwordCtrl.setValue('');
        this.notSent = true;
        this.errorMessage = 'Misslyckades att ändra lösenord. Försök igen.';
      }
    });
  }
}
