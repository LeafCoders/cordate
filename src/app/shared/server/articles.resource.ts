import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';

import { RestApiService } from './rest-api.service';
import { RestApiErrorService } from './rest-api-error.service';
import { DefaultBaseResource } from './default-base.resource';
import { IdModel, Article, User } from './rest-api.model';

export interface ArticleUpdate {
  id?: number;
  articleTypeId: number;
  articleSerieId?: number;
  eventId: number;
  time: string;
  authorIds: Array<number>;
  title: string;
  content?: string;
  recordingId?: number;
}

@Injectable()
export class ArticlesResource extends DefaultBaseResource<Article, ArticleUpdate> {

  constructor(
    api: RestApiService,
    apiError: RestApiErrorService,
  ) {
    super(api, 'articles', apiError);
  }

  newInstance(data?: any): Article {
    return new Article(data ? data : {});
  }

  updateInstance(from: Article): ArticleUpdate {
    if (from.id) {
      return <ArticleUpdate>{ id: from.id };
    } else {
      // TODO: Until time editor is implemented
      return <ArticleUpdate>{
        articleTypeId: from.articleTypeId,
        articleSerieId: IdModel.idOf(from.articleSerie),
        time: moment().toJSON(),
      };
    }
  }

  addAuthor(article: Article, userId: number): Observable<void> {
    return this.handleError<void>(
      this.api.create(`api/articles/${article.id}/authors/${userId}`)
        .map((data: Response): void => {
          article.authors = data.json().map(item => new User(item));
        })
    );
  }

  removeAuthor(article: Article, userId: number): Observable<void> {
    return this.handleError<void>(
      this.api.delete(`api/articles/${article.id}/authors/${userId}`)
        .map((data: Response): void => {
          article.authors = data.json().map(item => new User(item));
        })
    );
  }

}
