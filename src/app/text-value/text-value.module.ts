import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';
import { TextValueComponent } from './text-value.component';
import { TextValueEditorComponent } from './text-value-editor/text-value-editor.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
  ],
  declarations: [
    TextValueComponent,
    TextValueEditorComponent,
  ]
})
export class TextValueModule { }
