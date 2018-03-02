import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BaseContainer } from '../shared/base/base-container';
import { AuthPermissionService } from '../auth/auth-permission.service';
import { ArticleSeriesResource } from '../shared/server/article-series.resource';
import { ArticleTypesResource } from '../shared/server/article-types.resource';
import { ArticleSerie, ArticleType } from '../shared/server/rest-api.model';
import { ArticleSerieService } from './article-serie.service';

@Component({
  selector: 'lc-article-serie',
  templateUrl: './article-serie.component.html'
})
export class ArticleSerieComponent extends BaseContainer<ArticleSerie> {

  constructor(
    public viewData: ArticleSerieService,
    private articleSeriesResource: ArticleSeriesResource,
    private authPermission: AuthPermissionService,
    articleTypesResource: ArticleTypesResource,
    router: Router,
    route: ActivatedRoute,
  ) {
    super(articleSeriesResource, router, route);
    this.viewData.articleType = articleTypesResource.fromRoute(route);
  }

  protected init(): void {
    this.allowAddNew = this.authPermission.isPermitted(this.articleSeriesResource.createPermission());
  }

  createNew(): void {
    this.openEditorWithNew(new ArticleSerie({ articleTypeId: this.viewData.articleType.id }));
  }
}
