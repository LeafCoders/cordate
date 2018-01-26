import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';

import { EditorState } from '../editor-state';
import { IdModel, Location, ResourceType, Resource } from '../../server/rest-api.model';
import { ArticleSeriesResource } from '../../server/article-series.resource';
import { AssetFoldersResource } from '../../server/asset-folders.resource';
import { EventTypesResource } from '../../server/event-types.resource';
import { GroupsResource } from '../../server/groups.resource';
import { UsersResource } from '../../server/users.resource';
import { RestApiService } from '../../server/rest-api.service';

interface ResourceSelect {
  resource: Resource;
  selected: boolean;
}

@Component({
  selector: 'lc-resources-editor',
  templateUrl: './resources-editor.component.html'
})
export class ResourcesEditorComponent {

  @Input() icon: string;
  @Input() valueTitle: string;
  @Input() showClearOption: string;
  @Input() state: EditorState;
  @Output() changed: EventEmitter<IdModel> = new EventEmitter<IdModel>();

  private resourceType: ResourceType;
  resources: Array<ResourceSelect>;

  private refType: string;
  value: IdModel;
  refs: Array<IdModel>;
  noRefsFound: boolean = false;

  constructor(
    private api: RestApiService,
    private articleSeriesResource: ArticleSeriesResource,
    private assetFoldersResource: AssetFoldersResource,
    private eventTypesResource: EventTypesResource,
    private groupsResource: GroupsResource,
    private usersResource: UsersResource,
    private dialog: MatDialog
  ) { }

  @Input('resourceType')
  set setResourceType(resourceType: ResourceType) {
    this.resourceType = resourceType;

    this.api.read(`api/resourceTypes/${resourceType.id}/resources`)
      .subscribe(data => {
        this.resources = data.json().map(item => <ResourceSelect>{ resource: new Resource(item), selected: false })
        //if (resourceType.resources) {
        //  resourceType.resources.forEach((resource: Resource) => {
        //    let toSelect: ResourceSelect = this.resources.find((select: ResourceSelect) => select.resource.id === resource.id);
        //    if (toSelect) {
        //      toSelect.selected = true;
        //    }
        //  });
        //}
        //        this.trueFalseIcons = this.allowMultiSelect ? ['check_box', 'check_box_outline_blank'] : ['radio_button_checked', 'radio_button_unchecked'];

        //        this.assignPermission = this.authPermission.isPermitted(this.eventsResource.assignResourceRequirementPermission(this.event, resourceType.resourceType));
        //        this.managePermission = this.authPermission.isPermitted(this.eventsResource.manageResourceRequirementsPermission(this.event, resourceType.resourceType));
      });
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
