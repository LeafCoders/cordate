import { Component } from '@angular/core';

import { BaseList } from '../shared/base/base-list';
import { AuthPermissionService } from '../auth/auth-permission.service';
import { ArticleTypesResource } from '../shared/server/article-types.resource';
import { ArticleType, ArticleTypeList } from '../shared/server/rest-api.model';

@Component({
  selector: 'lc-article-type-list',
  templateUrl: './article-type-list.component.html'
})
export class ArticleTypeListComponent extends BaseList<ArticleType> {

  constructor(
    articleTypesResource: ArticleTypesResource,
  ) {
    super(articleTypesResource);
  }

  protected init(): void {
  }

}
