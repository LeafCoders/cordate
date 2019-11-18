import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MomentModule } from 'ngx-moment';

import { SharedModule } from '../shared/shared.module';
import { ArticleTypeComponent } from './article-type.component';
import { ArticleTypeListComponent } from './article-type-list.component';
import { ArticleTypeEditorComponent } from './article-type-editor.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MomentModule,
  ],
  declarations: [
    ArticleTypeComponent,
    ArticleTypeListComponent,
    ArticleTypeEditorComponent,
  ],
  entryComponents: [],
})
export class ArticleTypeModule { }
