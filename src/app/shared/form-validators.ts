import { FormControl, ValidatorFn } from '@angular/forms';
//import {  } from '@angular/forms/src/directives/validators';

interface ValidationResult {
  [key: string]: boolean;
}

export class FormValidators {
  static email(control: FormControl): ValidationResult {
    var EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    if (control.value !== "" && (control.value.length <= 5 || !EMAIL_REGEXP.test(control.value))) {
      return { "incorrectEmail": true };
    }
    return undefined;
  }

  static passwordsMatch(password: FormControl) {
    return function (repeatedPassword) {
      if (password.value !== repeatedPassword.value) {
        return { "mismatchedPasswords": true };
      }
      return undefined;
    };
  }
}
