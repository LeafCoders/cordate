import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { Observable, Subscriber } from 'rxjs';

import { ArticleTypesResource } from './shared/server/article-types.resource';
import { ArticlesResource } from './shared/server/articles.resource';
import { ArticleSeriesResource } from './shared/server/article-series.resource';
import { ArticleType, ArticleTypeList } from './shared/server/rest-api.model';

@Injectable()
export class ArticleTypeGuard implements CanActivate {

  private lastArticleTypeIdAlias: string;

  constructor(
    private articleTypesResource: ArticleTypesResource,
    private articlesResource: ArticlesResource,
    private articleSeriesResource: ArticleSeriesResource,
  ) { }

  canActivate(route: ActivatedRouteSnapshot): boolean | Observable<boolean> {
    if (route.url.length < 2) {
      return false;
    }
    const articleTypeIdAlias: string = route.url[1].path;
    if (this.lastArticleTypeIdAlias === articleTypeIdAlias) {
      return true;
    }
    this.lastArticleTypeIdAlias = articleTypeIdAlias;

    return Observable.create(observer => {
      let subscriber = new Subscriber<ArticleTypeList>((articleTypes: ArticleTypeList) => {
        subscriber.unsubscribe();
        const articleType: ArticleType = articleTypes.find(at => at.idAlias === articleTypeIdAlias);
        if (articleType) {
          this.articlesResource.setListParams({ articleTypeId: articleType.id });
          this.articleSeriesResource.setListParams({ articleTypeId: articleType.id });
          observer.next(true);
        } else {
          observer.next(false);
        }
        observer.complete();
      });
      this.articleTypesResource.list().subscribe(subscriber);
    });
  }
}
