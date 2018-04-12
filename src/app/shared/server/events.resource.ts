import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { RestApiService } from './rest-api.service';
import { RestApiErrorService } from './rest-api-error.service';
import { DefaultBaseResource } from './default-base.resource';
import { IdModel, Event, User, ResourceRequirement, Resource, ResourceList, ResourceType, ResourceTypeRef, ArticleList, Article } from './rest-api.model';

export interface EventUpdate {
  id: number;
  eventTypeId: number;
  startTime: string;
  endTime: string;
  title: string;
  description: string;
}

@Injectable()
export class EventsResource extends DefaultBaseResource<Event, EventUpdate> {

  constructor(
    api: RestApiService,
    apiError: RestApiErrorService,
  ) {
    super(api, 'events', apiError);
  }

  newInstance(data?: any): Event {
    return new Event(data ? data : {});
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
      };
    }
  }

  refresh(): void {
    this.refreshList(true);
  }

  addResourceRequirement(event: Event, resourceType: ResourceType): Observable<void> {
    return this.handleError<void>(
      this.api.create<any[]>(`api/events/${event.id}/resourceRequirements`, undefined, { resourceTypeId: resourceType.id })
        .map((data): void => {
          event.resourceRequirements = data.map(item => new ResourceRequirement(item));
        })
    );
  }

  removeResourceRequirement(event: Event, resourceRequirement: ResourceRequirement): Observable<void> {
    return this.handleError<void>(
      this.api.delete<any[]>(`api/events/${event.id}/resourceRequirements/${resourceRequirement.id}`)
        .map((data): void => {
          event.resourceRequirements = data.map(item => new ResourceRequirement(item));
        })
    );
  }

  addResource(event: Event, resourceRequirement: ResourceRequirement, resource?: Resource): Observable<void> {
    let oneOrAll: Object = resource ? { resourceId: resource.id } : undefined;
    return this.handleError<void>(
      this.api.create<any[]>(`api/events/${event.id}/resourceRequirements/${resourceRequirement.id}/resources`, oneOrAll)
        .map((data): void => {
          resourceRequirement.resources = data.map(item => new Resource(item));
        })
    );
  }

  removeResource(event: Event, resourceRequirement: ResourceRequirement, resource?: Resource): Observable<void> {
    let oneOrAll: string = resource ? `/${resource.id}` : '';
    return this.handleError<void>(
      this.api.delete<any[]>(`api/events/${event.id}/resourceRequirements/${resourceRequirement.id}/resources${oneOrAll}`)
        .map((data): void => {
          resourceRequirement.resources = data.map(item => new Resource(item));
        })
    );
  }

  manageResourceRequirementsPermission(event: Event, resourceType: ResourceType | ResourceTypeRef): string {
    return `events:update:${event.id};eventsByEventTypes:update:${event.eventType.id};events:assign:resourceTypes:${resourceType.id}`;
  }

  assignResourceRequirementPermission(event: Event, resourceType: ResourceType | ResourceTypeRef): string {
    return `events:update:${event.id};eventsByEventTypes:update:${event.eventType.id};events:assign:resourceTypes:${resourceType.id}`;
  }

  readArticles(event: Event): Observable<ArticleList> {
    return this.handleError<ArticleList>(
      this.api.read<any[]>(`api/events/${event.id}/articles`)
        .map((data): ArticleList => {
          return data.map(item => new Article(item));
        })
    );
  }

}
