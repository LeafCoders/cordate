import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BaseContainer } from '../shared/base/base-container';
import { AuthPermissionService } from '../auth/auth-permission.service';
import { ArticleTypesResource } from '../shared/server/article-types.resource';
import { ArticleType } from '../shared/server/rest-api.model';

@Component({
  selector: 'lc-article-type',
  templateUrl: './article-type.component.html'
})
export class ArticleTypeComponent extends BaseContainer<ArticleType> {

  constructor(
    private articleTypesResource: ArticleTypesResource,
    private authPermission: AuthPermissionService,
    router: Router,
    route: ActivatedRoute,
  ) {
    super(articleTypesResource, router, route);
  }

  protected init(): void {
    this.allowAddNew = this.authPermission.isPermitted(this.articleTypesResource.createPermission());
  }
}
