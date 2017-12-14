import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { RestApiService } from './rest-api.service';
import { RestApiErrorService } from './rest-api-error.service';
import { DefaultBaseResource } from './default-base.resource';
import { IdModel, ArticleSerie } from './rest-api.model';

export interface ArticleSerieUpdate {
  id: number;
  articleTypeId: number;
  idAlias: string;
  title: string;
  content: string;
}

@Injectable()
export class ArticleSeriesResource extends DefaultBaseResource<ArticleSerie, ArticleSerieUpdate> {

  constructor(
    api: RestApiService,
    apiError: RestApiErrorService,
  ) {
    super(api, 'articleSeries', apiError);
  }

  newInstance(data?: any): ArticleSerie {
    return new ArticleSerie(data ? data : {});
  }

  updateInstance(from: ArticleSerie): ArticleSerieUpdate {
    if (from.id) {
      return <ArticleSerieUpdate>{ id: from.id };
    } else {
      return <ArticleSerieUpdate>{
        articleTypeId: from.articleTypeId,
      };
    }
  }

}
