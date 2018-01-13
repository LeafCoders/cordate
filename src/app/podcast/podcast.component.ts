import { Component, OnInit } from '@angular/core';

import { BaseContainer } from '../shared/base/base-container';
import { AuthPermissionService } from '../auth/auth-permission.service';
import { PodcastsResource } from '../shared/server/podcasts.resource';
import { Podcast } from '../shared/server/rest-api.model';

@Component({
  selector: 'lc-podcast',
  templateUrl: './podcast.component.html'
})
export class PodcastComponent extends BaseContainer<Podcast> {

  constructor(
    private podcastsResource: PodcastsResource,
    private authPermission: AuthPermissionService,
  ) {
    super(podcastsResource);
  }

  protected init(): void {
    this.allowAddNew = this.authPermission.isPermitted(this.podcastsResource.createPermission());
  }
}
