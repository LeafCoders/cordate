import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { RestApiService } from './rest-api.service';
import { DefaultBaseResource } from './default-base.resource';
import { IdModel, Article, User, Resource } from './rest-api.model';

export interface ArticleUpdate {
  id?: number;
  articleTypeId: number;
  articleSerieId?: number;
  eventId?: number;
  time: string;
  authorIds?: Array<number>;
  title?: string;
  contentRaw?: string;
  contentHtml?: string;
  recordingId?: number;
  recordingStatus?: string;
}

@Injectable()
export class ArticlesResource extends DefaultBaseResource<Article, ArticleUpdate> {

  constructor(
    api: RestApiService,
  ) {
    super(api, 'articles');
  }

  newInstance(data?: any): Article {
    return new Article(data ? data : {});
  }

  updateInstance(from: Article): ArticleUpdate {
    if (from.id) {
      return <ArticleUpdate>{ id: from.id };
    } else {
      // TODO: Until time editor is implemented
      return {
        articleTypeId: from.articleTypeId,
        articleSerieId: IdModel.idOf(from.articleSerie),
        time: moment().toJSON(),
        recordingStatus: from.recordingStatus,
      };
    }
  }

  addAuthor(article: Article, userId: number): Observable<void> {
    return this.api.create<any[]>(`api/articles/${article.id}/authors/${userId}`).pipe(
      map((data): void => {
        article.authors = data.map(item => new Resource(item).asRef());
        this.replaceUpdated(article);
      })
    );
  }

  removeAuthor(article: Article, userId: number): Observable<void> {
    return this.api.delete<any[]>(`api/articles/${article.id}/authors/${userId}`).pipe(
      map((data): void => {
        article.authors = data.map(item => new Resource(item).asRef());
        this.replaceUpdated(article);
      })
    );
  }

}
