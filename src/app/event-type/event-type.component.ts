import { Component, OnInit } from '@angular/core';

import { BaseContainer } from '../shared/base/base-container';
import { AuthPermissionService } from '../auth/auth-permission.service';
import { EventTypesResource } from '../shared/server/event-types.resource';
import { EventType } from '../shared/server/rest-api.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'lc-event-type',
  templateUrl: './event-type.component.html'
})
export class EventTypeComponent extends BaseContainer<EventType> {

  constructor(
    private eventTypesResource: EventTypesResource,
    private authPermission: AuthPermissionService,
    router: Router,
    route: ActivatedRoute,
  ) {
    super(eventTypesResource, router, route);
  }

  protected init(): void {
    this.allowAddNew = this.authPermission.isPermitted(this.eventTypesResource.createPermission());
  }
}
