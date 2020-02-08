import { Component, EventEmitter, Input, Output } from '@angular/core';

import { EditorState } from '../editor-state';
import { IdModel, ArticleSerie, Event } from '../../server/rest-api.model';
import { ArticleSeriesResource } from '../../server/article-series.resource';
import { ArticleTypesResource } from '../../server/article-types.resource';
import { AssetFoldersResource } from '../../server/asset-folders.resource';
import { EventTypesResource } from '../../server/event-types.resource';
import { GroupsResource } from '../../server/groups.resource';
import { ResourceTypesResource } from '../../server/resource-types.resource';
import { UsersResource } from '../../server/users.resource';
import { EventsResource } from '../../server/events.resource';
import { MatDialog } from '@angular/material';
import { SingleSelectDialogComponent } from '../../dialog/single-select-dialog/single-select-dialog.component';
import { of } from 'rxjs';

const MAX_VISIBLE_ITEMS = 10;

@Component({
  selector: 'lc-ref-editor',
  templateUrl: './ref-editor.component.html'
})
export class RefEditorComponent {

  @Input() icon: string;
  @Input() valueTitle: string;
  @Input() showClearOption: string;
  @Input() state: EditorState;
  @Output() changed: EventEmitter<IdModel> = new EventEmitter<IdModel>();

  value: IdModel;
  visibleRefs: Array<IdModel>;
  allRefs: Array<IdModel>;
  noRefsFound: boolean = false;
  showViewMore: boolean = false;
  loading: boolean = true;

  constructor(
    private articleSeriesResource: ArticleSeriesResource,
    private articleTypesResource: ArticleTypesResource,
    private assetFoldersResource: AssetFoldersResource,
    private eventsResource: EventsResource,
    private eventTypesResource: EventTypesResource,
    private groupsResource: GroupsResource,
    private resourceTypesResource: ResourceTypesResource,
    private usersResource: UsersResource,
    private dialog: MatDialog,
  ) { }

  @Input('refType')
  set inRefType(inRefType: string) {
    this.visibleRefs = undefined;
    this.allRefs = undefined;
    this.noRefsFound = false;
    this.loading = true;

    const setRefs = (refs: Array<IdModel>): void => {
      this.noRefsFound = !(refs && refs.length);
      this.allRefs = refs;
      this.visibleRefs = this.allRefs.slice(0, MAX_VISIBLE_ITEMS);
      this.showViewMore = this.allRefs.length !== this.visibleRefs.length;
      this.loading = false;
    };

    switch (inRefType) {
      case 'articleSerie':
        this.icon = this.icon ? this.icon : 'local_offer';
        this.articleSeriesResource.listOnce().subscribe((refs: Array<ArticleSerie>) => {
          setRefs(refs.sort((a, b) => a.compareTo(b)));
        });
        break;
      case 'articleType':
        this.icon = this.icon ? this.icon : 'local_offer';
        this.articleTypesResource.listOnce().subscribe(setRefs);
        break;
      case 'assetFolder':
        this.icon = this.icon ? this.icon : 'folder';
        this.assetFoldersResource.listOnce().subscribe(setRefs);
        break;
      case 'event':
        this.icon = this.icon ? this.icon : 'event';
        this.eventsResource.listOnce().subscribe((refs: Array<Event>) => {
          setRefs(refs.sort((a, b) => -a.asText().localeCompare(b.asText())));
        });
        break;
      case 'eventType':
        this.icon = this.icon ? this.icon : 'local_offer';
        this.eventTypesResource.listOnce().subscribe(setRefs);
        break;
      case 'group':
        this.icon = this.icon ? this.icon : 'group';
        this.groupsResource.listOnce().subscribe(setRefs);
        break;
      case 'resourceType':
        this.icon = this.icon ? this.icon : 'local_offer';
        this.resourceTypesResource.listOnce().subscribe(setRefs);
        break;
      case 'user':
        this.icon = this.icon ? this.icon : 'person';
        this.usersResource.listOnce().subscribe(setRefs);
        break;
    }
  }

  @Input('value')
  set inValue(inValue: IdModel) {
    this.value = inValue;
  }

  refSelected(ref: IdModel): void {
    if (this.state.createMode) {
      this.value = ref;
    }
    this.changed.emit(ref);
  }

  clear(): void {
    this.changed.emit(undefined);
  }

  openViewMoreDialog(): void {
    this.dialog.open(SingleSelectDialogComponent).componentInstance.init(
      this.valueTitle, of(this.allRefs),
      (ref: IdModel) => {
        this.value = ref;
      });
  }

}
