import { Injectable } from '@angular/core';

import { RestApiService } from './rest-api.service';
import { RestApiErrorService } from './rest-api-error.service';
import { DefaultBaseResource } from './default-base.resource';
import { Podcast, ArticleType } from './rest-api.model';

import * as moment from 'moment';

export interface PodcastUpdate {
  articleTypeId: number;
  id: number;
  idAlias: string;
  title: string;
  subTitle: string;
  authorName: string;
  copyright: string;
  description: string;
  mainCategory: string;
  subCategory: string;
  language: string;
  link: string;
  imageId: number;
}

@Injectable()
export class PodcastsResource extends DefaultBaseResource<Podcast, PodcastUpdate> {

  constructor(
    api: RestApiService,
    apiError: RestApiErrorService,
  ) {
    super(api, 'podcasts', apiError);
  }

  newInstance(data?: any): Podcast {
    return new Podcast(data ? data : {
      articleTypeId: ArticleType.SERMON,
      copyright: `© ${moment().year()} Your name`,
      mainCategory: 'Religion & Spirituality',
      subCategory: 'Christianity',
      language: 'sv-se',
      link: 'https://your.domain'
    });
  }

  updateInstance(from: Podcast): PodcastUpdate {
    if (from.id) {
      return <PodcastUpdate>{ id: from.id }
    } else {
      return <PodcastUpdate>{
        articleTypeId: from.articleTypeId,
        copyright: from.copyright,
        mainCategory: from.mainCategory,
        subCategory: from.subCategory,
        language: from.language,
        link: from.link
      };
    }
  }

}
