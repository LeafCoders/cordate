import { Injectable } from '@angular/core';

import { RestApiService } from './rest-api.service';
import { DefaultBaseResource } from './default-base.resource';
import { Podcast, IdModel } from './rest-api.model';

import * as moment from 'moment';

export interface PodcastUpdate {
  articleTypeId: number;
  id: number;
  idAlias: string;
  title: string;
  subTitle: string;
  authorName: string;
  authorEmail: string;
  authorLink: string;
  copyright: string;
  description: string;
  mainCategory: string;
  subCategory: string;
  language: string;
  articlesLink: string;
  imageId: number;
}

@Injectable()
export class PodcastsResource extends DefaultBaseResource<Podcast, PodcastUpdate> {

  constructor(
    api: RestApiService,
  ) {
    super(api, 'podcasts');
  }

  newInstance(data?: any): Podcast {
    return new Podcast(data ? data : {
      copyright: `© ${moment().year()} Your name`,
      mainCategory: 'Religion & Spirituality',
      subCategory: 'Christianity',
      language: 'sv-se',
      authorEmail: 'your-email@domain',
      authorLink: 'https://your.domain',
      articlesLink: 'https://your.domain/articles'
    });
  }

  updateInstance(from: Podcast): PodcastUpdate {
    if (from.id) {
      return <PodcastUpdate>{ id: from.id }
    } else {
      return <PodcastUpdate>{
        articleTypeId: IdModel.idOf(from.articleType),
        copyright: from.copyright,
        mainCategory: from.mainCategory,
        subCategory: from.subCategory,
        language: from.language,
        authorEmail: from.authorEmail,
        authorLink: from.authorLink,
        articlesLink: from.articlesLink
      };
    }
  }

}
