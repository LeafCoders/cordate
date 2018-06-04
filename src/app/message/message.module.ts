import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MomentModule } from 'angular2-moment';

import { SharedModule } from '../shared/shared.module';
import { MessageComponent } from './message.component';
import { MessageListComponent } from './message-list.component';
import { MessageEditorComponent } from './message-editor.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MomentModule,
  ],
  declarations: [
    MessageComponent,
    MessageListComponent,
    MessageEditorComponent,
  ],
  entryComponents: [],
})
export class MessageModule { }
