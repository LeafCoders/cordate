import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MomentModule } from 'angular2-moment';

import { SharedModule } from '../shared/shared.module';
import { ArticleSerieComponent } from './article-serie.component';
import { ArticleSerieListComponent } from './article-serie-list.component';
import { ArticleSerieEditorComponent } from './article-serie-editor.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MomentModule,
  ],
  declarations: [
    ArticleSerieComponent,
    ArticleSerieListComponent,
    ArticleSerieEditorComponent,
  ],
  entryComponents: [],
})
export class ArticleSerieModule { }
