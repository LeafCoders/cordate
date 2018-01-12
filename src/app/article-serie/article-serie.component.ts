import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BaseContainer } from '../shared/base/base-container';
import { AuthPermissionService } from '../auth/auth-permission.service';
import { ArticleSeriesResource } from '../shared/server/article-series.resource';
import { ArticleSerie, ArticleType, ArticleTypeData, ArticleTypes } from '../shared/server/rest-api.model';

@Component({
  selector: 'lc-article-serie',
  templateUrl: './article-serie.component.html'
})
export class ArticleSerieComponent extends BaseContainer<ArticleSerie> {

  articleTypeData: ArticleTypeData;

  constructor(
    private articleSeriesResource: ArticleSeriesResource,
    private authPermission: AuthPermissionService,
    route: ActivatedRoute,
  ) {
    super(articleSeriesResource);
    this.articleTypeData = ArticleTypes[(<{ articleType: ArticleType }>route.snapshot.data).articleType];
  }

  protected init(): void {
    this.allowAddNew = this.authPermission.isPermitted(this.articleSeriesResource.createPermission());
  }

  createNew(): void {
    this.openEditorWithNew(new ArticleSerie({ articleTypeId: this.articleTypeData.articleTypeId }));
  }
}
