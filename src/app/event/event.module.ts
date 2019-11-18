import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MomentModule } from 'ngx-moment';

import { SharedModule } from '../shared/shared.module';
import { EventComponent } from './event.component';
import { EventListComponent } from './event-list.component';
import { EventEditorComponent } from './event-editor.component';
import { EventNewDialogComponent } from './new-dialog/event-new-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MomentModule,
  ],
  declarations: [
    EventComponent,
    EventListComponent,
    EventEditorComponent,
    EventNewDialogComponent,
  ],
  entryComponents: [
    EventNewDialogComponent,
  ],
})
export class EventModule { }
