import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { AuthService } from '../auth.service';
import { FormValidators } from '../../shared/form-validators';

@Component({
  selector: 'lc-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  public notSent: boolean = true;
  public sending: boolean = false;
  public success: boolean = false;
  public errorMessage: string;

  public form: FormGroup;
  private emailCtrl: FormControl = new FormControl('', Validators.compose([Validators.required]));//, FormValidators.email]));
  private firstNameCtrl: FormControl = new FormControl('', Validators.required);
  private lastNameCtrl: FormControl = new FormControl('', Validators.required);
  private passwordCtrl: FormControl = new FormControl('', Validators.required);
  private repeatedCtrl: FormControl = new FormControl(
    '', Validators.compose([Validators.required, FormValidators.passwordsMatch(this.passwordCtrl)])
  );
  private wantedPermissionsCtrl: FormControl = new FormControl('', Validators.required);

  constructor(
    private authService: AuthService,
    builder: FormBuilder
  ) {
    this.form = builder.group({
      email: this.emailCtrl,
      firstName: this.firstNameCtrl,
      lastName: this.lastNameCtrl,
      password: this.passwordCtrl,
      repeated: this.repeatedCtrl,
      wantedPermissions: this.wantedPermissionsCtrl
    });
  }

  ngOnInit() {
  }

  public signup(): void {
    if (!this.form.valid) {
      return;
    }
    this.errorMessage = undefined;
    this.notSent = false;
    this.sending = true;

    this.authService.signup(
      this.emailCtrl.value, this.firstNameCtrl.value, this.lastNameCtrl.value,
      this.passwordCtrl.value, this.wantedPermissionsCtrl.value
    ).subscribe((success: boolean) => {
      this.sending = false;
      if (success) {
        this.success = true;
      } else {
        this.notSent = true;
        this.errorMessage = 'Misslyckades att skapa konto.';
      }
    });
  }
}
