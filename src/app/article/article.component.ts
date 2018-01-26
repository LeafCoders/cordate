import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialogRef, MatDialog } from '@angular/material';
import { Observable } from 'rxjs/Observable';

import { BaseContainer } from '../shared/base/base-container';
import { AuthPermissionService } from '../auth/auth-permission.service';
import { ArticleSeriesResource } from '../shared/server/article-series.resource';
import { ArticleTypesResource } from '../shared/server/article-types.resource';
import { ArticlesResource } from '../shared/server/articles.resource';
import { Article, ArticleType, ArticleSerie } from '../shared/server/rest-api.model';
import { ArticleNewDialogComponent } from './new-dialog/article-new-dialog.component';

@Component({
  selector: 'lc-article',
  templateUrl: './article.component.html'
})
export class ArticleComponent extends BaseContainer<Article> {

  private newArticleDialogRef: MatDialogRef<ArticleNewDialogComponent>;
  articleType: ArticleType;

  constructor(
    private articlesResource: ArticlesResource,
    private articleSeriesResource: ArticleSeriesResource,
    private authPermission: AuthPermissionService,
    private dialog: MatDialog,
    articleTypesResource: ArticleTypesResource,
    route: ActivatedRoute,
  ) {
    super(articlesResource);
    this.articleType = articleTypesResource.fromRoute(route);
  }

  protected init(): void {
    this.allowAddNew = this.authPermission.isPermitted(this.articlesResource.createPermission());
  }

  showNewDialog(): void {
    this.newArticleDialogRef = this.dialog.open(ArticleNewDialogComponent);
    this.newArticleDialogRef.componentInstance.newTitle = this.articleType.newArticleTitle;

    this.newArticleDialogRef.afterClosed().subscribe((data: ArticleSerie) => {
      if (data) {
        this.openEditorWithNew(new Article({
          articleTypeId: this.articleType.id,
          articleSerie: data.asRef(),
        }));
      }
    });
  }

}
