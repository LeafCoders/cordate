import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MomentModule } from 'angular2-moment';

import { SharedModule } from '../shared/shared.module';
import { EventTypeComponent } from './event-type.component';
import { EventTypeListComponent } from './event-type-list.component';
import { EventTypeEditorComponent } from './event-type-editor.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MomentModule,
  ],
  declarations: [
    EventTypeComponent,
    EventTypeListComponent,
    EventTypeEditorComponent,
  ],
  entryComponents: [],
})
export class EventTypeModule { }
