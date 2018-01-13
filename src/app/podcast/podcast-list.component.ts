import { Component } from '@angular/core';

import { BaseList } from '../shared/base/base-list';
import { AuthPermissionService } from '../auth/auth-permission.service';
import { PodcastsResource } from '../shared/server/podcasts.resource';
import { Podcast, PodcastList } from '../shared/server/rest-api.model';

@Component({
  selector: 'lc-podcast-list',
  templateUrl: './podcast-list.component.html'
})
export class PodcastListComponent extends BaseList<Podcast> {

  constructor(
    private podcastsResource: PodcastsResource,
    private authPermission: AuthPermissionService,
  ) {
    super(podcastsResource, () => podcastsResource.list());
  }

  protected init(): void {
  }

}
