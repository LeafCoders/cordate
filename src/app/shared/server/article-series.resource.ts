import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { RestApiService } from './rest-api.service';
import { DefaultBaseResource } from './default-base.resource';
import { IdModel, ArticleSerie } from './rest-api.model';

export interface ArticleSerieUpdate {
  id: number;
  articleTypeId: number;
  idAlias: string;
  title: string;
  contentRaw: string;
  contentHtml: string;
  imageId: number;
}

@Injectable()
export class ArticleSeriesResource extends DefaultBaseResource<ArticleSerie, ArticleSerieUpdate> {

  constructor(
    api: RestApiService,
  ) {
    super(api, 'articleSeries', (a, b) => a.lastUseTime && a.lastUseTime.isAfter(b.lastUseTime));
  }

  newInstance(data?: any): ArticleSerie {
    return new ArticleSerie(data ? data : {});
  }

  updateInstance(from: ArticleSerie): ArticleSerieUpdate {
    if (from.id) {
      return <ArticleSerieUpdate>{ id: from.id };
    } else {
      return <ArticleSerieUpdate>{
        idAlias: from.idAlias,
        articleTypeId: from.articleTypeId,
      };
    }
  }

}
