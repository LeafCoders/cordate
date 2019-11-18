import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MomentModule } from 'ngx-moment';

import { SharedModule } from '../shared/shared.module';
import { UserComponent } from './user.component';
import { UserListComponent } from './user-list.component';
import { UserEditorComponent } from './user-editor.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MomentModule,
  ],
  declarations: [
    UserComponent,
    UserListComponent,
    UserEditorComponent,
  ],
  entryComponents: [],
})
export class UserModule { }
