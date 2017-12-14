import { Component } from '@angular/core';

import { BaseList } from '../shared/base/base-list';
import { AuthPermissionService } from '../auth/auth-permission.service';
import { ArticleSeriesResource } from '../shared/server/article-series.resource';
import { ArticleSerie, ArticleSerieList } from '../shared/server/rest-api.model';

@Component({
  selector: 'lc-article-serie-list',
  templateUrl: './article-serie-list.component.html'
})
export class ArticleSerieListComponent extends BaseList<ArticleSerie> {

  constructor(
    private articleSeriesResource: ArticleSeriesResource,
    private authPermission: AuthPermissionService,
  ) {
    super(articleSeriesResource, () => articleSeriesResource.list());
  }

  protected init(): void {
  }

}
