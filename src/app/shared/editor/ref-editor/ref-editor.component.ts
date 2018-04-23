import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';

import { EditorState } from '../editor-state';
import { IdModel, Location } from '../../server/rest-api.model';
import { ArticleSeriesResource } from '../../server/article-series.resource';
import { ArticleTypesResource } from '../../server/article-types.resource';
import { AssetFoldersResource } from '../../server/asset-folders.resource';
import { EventTypesResource } from '../../server/event-types.resource';
import { GroupsResource } from '../../server/groups.resource';
import { ResourceTypesResource } from '../../server/resource-types.resource';
import { UsersResource } from '../../server/users.resource';
import { EventsResource } from '../../server/events.resource';

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

  private refType: string;
  value: IdModel;
  refs: Array<IdModel>;
  noRefsFound: boolean = false;

  constructor(
    private articleSeriesResource: ArticleSeriesResource,
    private articleTypesResource: ArticleTypesResource,
    private assetFoldersResource: AssetFoldersResource,
    private eventsResource: EventsResource,
    private eventTypesResource: EventTypesResource,
    private groupsResource: GroupsResource,
    private resourceTypesResource: ResourceTypesResource,
    private usersResource: UsersResource,
    private dialog: MatDialog
  ) { }

  @Input('refType')
  set inRefType(inRefType: string) {
    this.refType = inRefType;
    this.refs = undefined;
    this.noRefsFound = false;

    const setRefs = (refs: Array<IdModel>): void => {
      this.refs = refs;
      this.noRefsFound = !(refs && refs.length);
    };

    switch (inRefType) {
      case 'articleSerie':
        this.icon = this.icon ? this.icon : 'local_offer';
        this.articleSeriesResource.listOnce().subscribe(setRefs);
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
        this.eventsResource.listOnce().subscribe(setRefs);
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
}
