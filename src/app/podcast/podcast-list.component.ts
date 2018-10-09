import { Component } from '@angular/core';

import { BaseList } from '../shared/base/base-list';
import { PodcastsResource } from '../shared/server/podcasts.resource';
import { Podcast } from '../shared/server/rest-api.model';
import { environment } from '../../environments/environment';

@Component({
  selector: 'lc-podcast-list',
  templateUrl: './podcast-list.component.html'
})
export class PodcastListComponent extends BaseList<Podcast> {

  rosetteUrl: string = environment.rosetteUrl;

  constructor(
    podcastsResource: PodcastsResource,
  ) {
    super(podcastsResource, () => podcastsResource.list());
  }

  protected init(): void {
  }

}
