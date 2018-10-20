import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as moment from 'moment';

import { BaseList } from '../shared/base/base-list';
import { EventsResource } from '../shared/server/events.resource';
import { Event, EventList, ResourceRequirement } from '../shared/server/rest-api.model';
import { FilterItem, NONE_FILTER } from './event-common';
import { ItemsGroup, itemsGrouper } from '../shared/items-grouper';
import { EventResourcesUpdater } from '../shared/server/resources-updater';

interface EventViewModel {
  event: Event;
  descriptions: Array<string>;
  privateDescriptions: Array<string>;
  dayNumber: number;
  dayName: string;
  monthName: string;
  time: string;
  eventTypeName: string;
  selectableResourceRequirementUpdater?: EventResourcesUpdater;
  resourceRequirements: Array<{ resourceTypeName: string, resourceNames: string, highlight: boolean }>;
}

@Component({
  selector: 'lc-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss']
})
export class EventListComponent extends BaseList<Event> {

  eventGroups: Array<ItemsGroup<Event>>;
  isWeekView: boolean = true;
  filter: FilterItem = NONE_FILTER;

  @Input('allowAddNew') allowAddNew: boolean = false;

  @Output('create') createEmitter: EventEmitter<moment.Moment> = new EventEmitter<moment.Moment>();

  constructor(
    private eventsResource: EventsResource,
  ) {
    super(eventsResource, () => eventsResource.list());
  }

  protected init(): void {
    this.eventsResource.list().subscribe((events: EventList) => {
      this.groupEvents(this.filterEvents(events));
    });
  }

  @Input('isWeekView')
  set setIsWeekView(isWeekView: boolean) {
    this.isWeekView = isWeekView;
    this.groupEvents(this.filterEvents(this.items));
  };

  @Input('filter')
  set setFilter(filer: FilterItem) {
    this.filter = filer;
    this.groupEvents(this.filterEvents(this.items));
  };

  createNew(eventGroup: ItemsGroup<Event>): void {
    this.createEmitter.emit(eventGroup.data);
  }

  updateEventViewModel(): void {
    // For now. Could be done better...
    this.groupEvents(this.filterEvents(this.items));
  }

  private filterEvents(events: EventList): EventList {
    if (this.filter === NONE_FILTER) {
      return events;
    }
    if (this.filter.resourceType) {
      return events.filter((event: Event): boolean => {
        return event.resourceRequirements.some((rr: ResourceRequirement): boolean => {
          return rr.resourceType.idEquals(this.filter.resourceType);
        });
      });
    }
  }

  private groupEvents(events: EventList): void {
    if (this.isWeekView) {
      this.eventGroups = itemsGrouper(
        (item: Event) => item.startTime.format('YYYYWW'),
        (item: Event) => {
          return {
            title: item.startTime.format('[v]W YYYY'),
            data: item.startTime.clone().startOf('week'),
            items: []
          };
        },
        this.eventToViewModel.bind(this),
        events
      );
    } else {
      this.eventGroups = itemsGrouper(
        (item: Event) => item.startTime.format('YYYYMM'),
        (item: Event) => {
          return {
            title: item.startTime.format('MMMM YYYY'),
            data: item.startTime.clone().startOf('month'),
            items: []
          };
        },
        this.eventToViewModel.bind(this),
        events
      );
    }
  }

  private eventToViewModel(event: Event): EventViewModel {
    let time: moment.Moment = moment(event.startTime);
    let description: string = event.description ? event.description : '';
    let privateDescription: string = event.privateDescription ? event.privateDescription : '';

    let selectableResourceRequirement: ResourceRequirement;
    if (this.filter.resourceType) {
      selectableResourceRequirement = event.resourceRequirements.find((rr: ResourceRequirement): boolean => {
        return rr.resourceType.idEquals(this.filter.resourceType);
      });
    }

    return {
      event: event,
      descriptions: description.split("\n"),
      privateDescriptions: privateDescription.split("\n"),
      dayNumber: time.date(),
      dayName: time.format('ddd'),
      monthName: time.format('MMM'),
      time: time.format('HH:mm'),
      eventTypeName: event.eventType.name,
      selectableResourceRequirementUpdater: selectableResourceRequirement ? new EventResourcesUpdater(event, this.eventsResource, selectableResourceRequirement) : undefined,
      resourceRequirements: event.resourceRequirements.map((rr: ResourceRequirement) => {
        return {
          resourceTypeName: rr.resourceType.name,
          resourceNames: rr.asText(),
          highlight: rr === selectableResourceRequirement,
        };
      })
    }
  }

}
