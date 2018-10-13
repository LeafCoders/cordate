import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { RestApiService } from './rest-api.service';
import { DefaultBaseResource } from './default-base.resource';
import { IdModel, Event, User, ResourceRequirement, Resource, ResourceList, ResourceType, ResourceTypeRef, ArticleList, Article } from './rest-api.model';

export interface EventUpdate {
  id: number;
  eventTypeId: number;
  startTime: string;
  endTime: string;
  title: string;
  description: string;
  isPublic: boolean;
}

@Injectable()
export class EventsResource extends DefaultBaseResource<Event, EventUpdate> {

  constructor(
    api: RestApiService,
  ) {
    super(api, 'events');
  }

  newInstance(data?: any): Event {
    return new Event(data ? data : { isPublic: true });
  }

  updateInstance(from: Event): EventUpdate {
    if (from.id) {
      return <EventUpdate>{ id: from.id };
    } else {
      return <EventUpdate>{
        eventTypeId: IdModel.idOf(from.eventType),
        startTime: from.startTime ? from.startTime.toJSON() : undefined,
        endTime: from.endTime ? from.endTime.toJSON() : undefined,
        title: from.title,
        description: from.description,
        isPublic: from.isPublic,
      };
    }
  }

  refresh(): void {
    this.refreshList(true);
  }

  refreshOnlyClient(): void {
    this.nextList();
  }

  addResourceRequirement(event: Event, resourceType: ResourceType): Observable<void> {
    return this.api.create<any[]>(`api/events/${event.id}/resourceRequirements`, undefined, { resourceTypeId: resourceType.id }).pipe(
      map((data): void => {
        event.resourceRequirements = data.map(item => new ResourceRequirement(item));
        this.replaceUpdated(event);
      })
    );
  }

  removeResourceRequirement(event: Event, resourceRequirement: ResourceRequirement): Observable<void> {
    return this.api.delete<any[]>(`api/events/${event.id}/resourceRequirements/${resourceRequirement.id}`).pipe(
      map((data): void => {
        event.resourceRequirements = data.map(item => new ResourceRequirement(item));
        this.replaceUpdated(event);
      })
    );
  }

  addResource(event: Event, resourceRequirement: ResourceRequirement, resource?: Resource): Observable<void> {
    let oneOrAll: Object = resource ? { resourceId: resource.id } : undefined;
    return this.api.create<any[]>(`api/events/${event.id}/resourceRequirements/${resourceRequirement.id}/resources`, oneOrAll).pipe(
      map((data): void => {
        resourceRequirement.resources = data.map(item => new Resource(item));
        this.replaceUpdated(event);
      })
    );
  }

  removeResource(event: Event, resourceRequirement: ResourceRequirement, resource?: Resource): Observable<void> {
    let oneOrAll: string = resource ? `/${resource.id}` : '';
    return this.api.delete<any[]>(`api/events/${event.id}/resourceRequirements/${resourceRequirement.id}/resources${oneOrAll}`).pipe(
      map((data): void => {
        resourceRequirement.resources = data.map(item => new Resource(item));
        this.replaceUpdated(event);
      })
    );
  }

  createPermission(): string {
    return this.combinePermissions(
      super.createPermission(),
      `eventTypes:createEvents`,  // TODO add eventType here
    );
  }

  updatePermission(event: Event): string {
    return this.combinePermissions(
      super.updatePermission(event),
      this.permissionValueWithId('eventTypes:updateEvents', event.eventType),
    );
  }

  deletePermission(event: Event): string {
    return this.combinePermissions(
      super.deletePermission(event),
      this.permissionValueWithId('eventTypes:deleteEvents', event.eventType),
    );
  }

  manageResourceRequirementsPermission(event: Event, resourceType: ResourceType | ResourceTypeRef): string {
    let resourceTypes = event.resourcesOfResourceType(resourceType);
    return this.combinePermissions(
      super.updatePermission(event),
      this.permissionValueWithId('eventTypes:updateEvents', event.eventType),
      this.permissionValueWithId('eventTypes:modifyEventResourceRequirements', event.eventType),
      ...resourceTypes.map(rt => this.permissionValueWithId('resourceTypes:modifyEventResourceRequirement', rt)),
    );
  }

  assignResourceRequirementPermission(event: Event, resourceType: ResourceType | ResourceTypeRef): string {
    let resourceTypes = event.resourcesOfResourceType(resourceType);
    return this.combinePermissions(
      super.updatePermission(event),
      this.permissionValueWithId('eventTypes:updateEvents', event.eventType),
      this.permissionValueWithId('eventTypes:assignEventResources', event.eventType),
      ...resourceTypes.map(rt => this.permissionValueWithId('resourceTypes:assignEventResources', rt)),
    );
  }

  readArticles(event: Event): Observable<ArticleList> {
    return this.api.read<any[]>(`api/events/${event.id}/articles`).pipe(
      map((data): ArticleList => {
        return data.map(item => new Article(item));
      })
    );
  }

}
