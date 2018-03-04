import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialogRef, MatDialog } from '@angular/material';
import { Observable } from 'rxjs/Observable';

import { BaseContainer } from '../shared/base/base-container';
import { AuthPermissionService } from '../auth/auth-permission.service';
import { ArticleSeriesResource } from '../shared/server/article-series.resource';
import { ArticleTypesResource } from '../shared/server/article-types.resource';
import { ArticlesResource } from '../shared/server/articles.resource';
import { Article, ArticleType, ArticleSerie } from '../shared/server/rest-api.model';
import { SingleSelectDialogComponent } from '../shared/dialog/single-select-dialog/single-select-dialog.component';
import { ArticleService } from './article.service';

@Component({
  selector: 'lc-article',
  templateUrl: './article.component.html'
})
export class ArticleComponent extends BaseContainer<Article> {

  constructor(
    public viewData: ArticleService,
    private articlesResource: ArticlesResource,
    private articleSeriesResource: ArticleSeriesResource,
    private authPermission: AuthPermissionService,
    private dialog: MatDialog,
    articleTypesResource: ArticleTypesResource,
    router: Router,
    route: ActivatedRoute,

  ) {
    super(articlesResource, router, route);
    this.viewData.articleType = articleTypesResource.fromRoute(route);
  }

  protected init(): void {
    this.allowAddNew = this.authPermission.isPermitted(this.articlesResource.createPermission());
  }

  showNewDialog(): void {
    this.dialog.open(SingleSelectDialogComponent).componentInstance.init(
      this.viewData.articleType.newArticleTitle, this.articleSeriesResource.listOnce(),
      (articleSerie: ArticleSerie) => {
        this.openEditorWithNew(new Article({
          articleTypeId: this.viewData.articleType.id,
          articleSerie: articleSerie.asRef(),
        }));
      });
  }

}
