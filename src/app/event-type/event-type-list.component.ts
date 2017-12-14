import { Component } from '@angular/core';

import { BaseList } from '../shared/base/base-list';
import { AuthPermissionService } from '../auth/auth-permission.service';
import { EventTypesResource } from '../shared/server/event-types.resource';
import { EventType, EventTypeList } from '../shared/server/rest-api.model';

@Component({
  selector: 'lc-event-type-list',
  templateUrl: './event-type-list.component.html'
})
export class EventTypeListComponent extends BaseList<EventType> {

  constructor(
    private eventTypesResource: EventTypesResource,
    private authPermission: AuthPermissionService,
  ) {
    super(eventTypesResource, () => eventTypesResource.list());
  }

  protected init(): void {
  }

}
