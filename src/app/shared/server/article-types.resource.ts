import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { RestApiService } from './rest-api.service';
import { DefaultBaseResource } from './default-base.resource';
import { ArticleType } from './rest-api.model';

export interface ArticleTypeUpdate {
  id: number;
  idAlias: string;
  articlesTitle: string;
  newArticleTitle: string;
  articleSeriesTitle: string;
  newArticleSerieTitle: string;
  imageFolderId: number;
  recordingFolderId: number;
  authorResourceTypeId: number;
  defaultRecordingStatus: string;
}

@Injectable()
export class ArticleTypesResource extends DefaultBaseResource<ArticleType, ArticleTypeUpdate> {

  constructor(
    api: RestApiService,
  ) {
    super(api, 'articleTypes');
  }

  newInstance(data?: any): ArticleType {
    return new ArticleType(data ? data : {});
  }

  updateInstance(from: ArticleType): ArticleTypeUpdate {
    return <ArticleTypeUpdate>{ id: from.id };
  }

  fromRoute(route: ActivatedRoute): ArticleType {
    const articleTypeIdAlias: string = route.snapshot.url[1].path;
    return this.findItemInLoadedList(at => at.idAlias === articleTypeIdAlias);
  }
}
