import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { RestApiService } from './rest-api.service';
import { DefaultBaseResource } from './default-base.resource';
import { IdModel, ArticleSerie } from './rest-api.model';

export interface ArticleSerieUpdate {
  id: number;
  articleTypeId: number;
  idAlias: string;
  title: string;
  content: string;
  imageId: number;
}

@Injectable()
export class ArticleSeriesResource extends DefaultBaseResource<ArticleSerie, ArticleSerieUpdate> {

  constructor(
    api: RestApiService,
  ) {
    super(api, 'articleSeries');
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
