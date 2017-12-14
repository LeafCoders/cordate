import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { AuthComponent } from '../auth/auth.component';
import { ForgottenComponent } from '../auth/forgotten/forgotten.component';
import { LoginComponent } from '../auth/login/login.component';
import { SignupComponent } from '../auth/signup/signup.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule, ReactiveFormsModule,
    HttpModule,
    RouterModule,
    SharedModule,
  ],
  declarations: [
    AuthComponent,
    ForgottenComponent,
    LoginComponent,
    SignupComponent,
  ],
  entryComponents: [],
  providers: [],
})
export class AuthModule { }
