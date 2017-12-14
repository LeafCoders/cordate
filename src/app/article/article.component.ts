import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialogRef, MatDialog } from '@angular/material';
import { Observable } from 'rxjs/Observable';

import { BaseContainer } from '../shared/base/base-container';
import { AuthPermissionService } from '../auth/auth-permission.service';
import { ArticleSeriesResource } from '../shared/server/article-series.resource';
import { ArticlesResource } from '../shared/server/articles.resource';
import { Article, ArticleType, ArticleTypeData, ArticleTypes, ArticleSerie } from '../shared/server/rest-api.model';
import { ArticleNewDialogComponent } from './new-dialog/article-new-dialog.component';

@Component({
  selector: 'lc-article',
  templateUrl: './article.component.html'
})
export class ArticleComponent extends BaseContainer<Article> {

  private newArticleDialogRef: MatDialogRef<ArticleNewDialogComponent>;
  articleTypeData: ArticleTypeData;

  constructor(
    private articlesResource: ArticlesResource,
    private articleSeriesResource: ArticleSeriesResource,
    private authPermission: AuthPermissionService,
    private dialog: MatDialog,
    route: ActivatedRoute,
  ) {
    super(articlesResource);
    this.articleTypeData = ArticleTypes[(<{ articleType: ArticleType }>route.snapshot.data).articleType];
  }

  protected init(): void {
    this.allowAddNew = this.authPermission.isPermitted(this.articlesResource.createPermission());
  }

  showNewDialog(): void {
    this.newArticleDialogRef = this.dialog.open(ArticleNewDialogComponent);
    this.newArticleDialogRef.componentInstance.newTitle = this.articleTypeData.newArticleTitle;

    this.newArticleDialogRef.afterClosed().subscribe((data: ArticleSerie) => {
      if (data) {
        this.openEditorWithNew(new Article({
          articleTypeId: this.articleTypeData.articleTypeId,
          articleSerie: data.asRef(),
        }));
      }
    });
  }

}
