import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { AuthService } from '../auth.service';
import { FormValidators } from '../../shared/form-validators';

@Component({
  selector: 'lc-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {

  notSent: boolean = true;
  sending: boolean = false;
  success: boolean = false;
  errorMessage: string;

  consentText: string = "Jag samtycker till att mina ifyllda uppgifter används till att skicka mig e-postmeddelanden för funktioner som krväs av applikationen (t.ex. Aktivera konto, Glömt lösenord m.m.), att endast mitt förnamn och efternamn kommer att presenteras för andra användare och att administratörer får tillgång till alla mina uppgifter.";

  form: FormGroup;
  emailCtrl: FormControl = new FormControl('', Validators.compose([Validators.required, FormValidators.email]));
  firstNameCtrl: FormControl = new FormControl('', Validators.required);
  lastNameCtrl: FormControl = new FormControl('', Validators.required);
  passwordCtrl: FormControl = new FormControl('', Validators.required);
  repeatedCtrl: FormControl = new FormControl(
    '', Validators.compose([Validators.required, FormValidators.passwordsMatch(this.passwordCtrl)])
  );
  wantedPermissionsCtrl: FormControl = new FormControl('', Validators.required);
  acceptConsentCtrl: FormControl = new FormControl('', Validators.required);

  constructor(
    private authService: AuthService
  ) {
    this.form = new FormGroup({
      email: this.emailCtrl,
      firstName: this.firstNameCtrl,
      lastName: this.lastNameCtrl,
      password: this.passwordCtrl,
      repeated: this.repeatedCtrl,
      wantedPermissions: this.wantedPermissionsCtrl,
      acceptConsent: this.acceptConsentCtrl,
    });
  }

  public signup(): void {
    if (!this.form.valid) {
      return;
    }
    this.form.disable();
    this.errorMessage = undefined;
    this.notSent = false;
    this.sending = true;

    this.authService.signup(
      this.emailCtrl.value, this.firstNameCtrl.value, this.lastNameCtrl.value,
      this.passwordCtrl.value, this.wantedPermissionsCtrl.value, this.consentText,
    ).subscribe((success: boolean) => {
      this.sending = false;
      if (success) {
        this.success = true;
      } else {
        this.form.enable();
        this.notSent = true;
        this.errorMessage = 'Misslyckades att skapa konto.';
      }
    });
  }
}
