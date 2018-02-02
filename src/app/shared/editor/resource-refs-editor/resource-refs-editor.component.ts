import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';

import { EditorState } from '../editor-state';
import { IdModel, Resource, ResourceRef, ResourceTypeRef } from '../../server/rest-api.model';
import { RestApiService } from '../../server/rest-api.service';

interface ResourceSelect {
  resource: Resource;
  selected: boolean;
}

@Component({
  selector: 'lc-resource-refs-editor',
  templateUrl: './resource-refs-editor.component.html'
})
export class ResourceRefsEditorComponent {

  @Input() icon: string;
  @Input() valueTitle: string;
  @Input() showClearOption: string;
  @Input() state: EditorState;
  @Output() changed: EventEmitter<Array<ResourceRef>> = new EventEmitter<Array<ResourceRef>>();

  private resourceType: ResourceTypeRef;
  resources: Array<ResourceSelect>;

  allowMultiSelect: boolean;
  trueFalseIcons: Array<string> = ['', ''];

  value: Array<ResourceRef>;

  saving: boolean = false;

  constructor(
    private api: RestApiService,
    private dialog: MatDialog
  ) { }

  @Input('resourceType')
  set setResourceType(resourceType: ResourceTypeRef) {
    this.resourceType = resourceType;

    this.api.read(`api/resourceTypes/${resourceType.id}/resources`)
      .subscribe(data => {
        this.resources = data.json().map(item => <ResourceSelect>{ resource: new Resource(item), selected: false })
        this.updateSelections();

        this.allowMultiSelect = true;
        this.trueFalseIcons = this.allowMultiSelect ? ['check_box', 'check_box_outline_blank'] : ['radio_button_checked', 'radio_button_unchecked'];
      });
  }

  @Input('value')
  set inValue(inValue: Array<ResourceRef>) {
    this.value = inValue;
    this.updateSelections();
  }

  valueAsString(): string {
    return this.value && this.value.length ? this.value.map(v => v.asText()).join(', ') : '-';
  }

  toggleSelect(select: ResourceSelect): void {
    if (this.allowMultiSelect) {
      select.selected = !select.selected;
    } else {
      this.resources.forEach((s: ResourceSelect) => s.selected = false);
      select.selected = true;
    }
    if (this.state.createMode) {
      this.value = this.resources.filter(r => r.selected).map(r => r.resource.asRef());
    }
    this.changed.emit(this.resources.filter(r => r.selected).map(r => r.resource.asRef()));
  }

  clear(): void {
    if (this.state.createMode) {
      this.value = [];
    }
    this.updateSelections();
    this.changed.emit(null);
  }

  private updateSelections(): void {
    if (this.resources) {
      this.resources.forEach((select: ResourceSelect): void => {
        select.selected = this.value ? this.value.some(select.resource.idEquals.bind(select.resource)) : false;
      });
    }
  }

}
