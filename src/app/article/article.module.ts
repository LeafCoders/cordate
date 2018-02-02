import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MomentModule } from 'angular2-moment';

import { SharedModule } from '../shared/shared.module';
import { ArticleComponent } from './article.component';
import { ArticleListComponent } from './article-list.component';
import { ArticleEditorComponent } from './article-editor.component';
import { ArticleNewDialogComponent } from './new-dialog/article-new-dialog.component';
import { ArticleService } from './article.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MomentModule,
  ],
  declarations: [
    ArticleComponent,
    ArticleListComponent,
    ArticleEditorComponent,
    ArticleNewDialogComponent,
  ],
  entryComponents: [
    ArticleNewDialogComponent,
  ],
  providers: [
    ArticleService,
  ],
})
export class ArticleModule { }
