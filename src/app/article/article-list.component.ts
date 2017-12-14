import { Component } from '@angular/core';

import { BaseList } from '../shared/base/base-list';
import { AuthPermissionService } from '../auth/auth-permission.service';
import { ArticlesResource } from '../shared/server/articles.resource';
import { Article, ArticleList } from '../shared/server/rest-api.model';

@Component({
  selector: 'lc-article-list',
  templateUrl: './article-list.component.html'
})
export class ArticleListComponent extends BaseList<Article> {

  constructor(
    private articlesResource: ArticlesResource,
    private authPermission: AuthPermissionService,
  ) {
    super(articlesResource);
  }

  protected init(): void {
  }

}
