import { Component, OnInit } from '@angular/core';

import { BaseContainer } from '../shared/base/base-container';
import { AuthPermissionService } from '../auth/auth-permission.service';
import { EventTypesResource } from '../shared/server/event-types.resource';
import { EventType } from '../shared/server/rest-api.model';

@Component({
  selector: 'lc-event-type',
  templateUrl: './event-type.component.html'
})
export class EventTypeComponent extends BaseContainer<EventType> {

  constructor(
    private eventTypesResource: EventTypesResource,
    private authPermission: AuthPermissionService,
  ) {
    super(eventTypesResource);
  }

  protected init(): void {
    this.allowAddNew = this.authPermission.isPermitted(this.eventTypesResource.createPermission());
  }
}
