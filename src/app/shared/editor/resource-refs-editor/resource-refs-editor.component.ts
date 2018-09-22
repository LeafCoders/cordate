import { Component, Input, EventEmitter, Output } from '@angular/core';

import { EditorState } from '../editor-state';
import { ResourceRef } from '../../server/rest-api.model';
import { ResourcesUpdater } from '../../server/resources-updater';

@Component({
  selector: 'lc-resource-refs-editor',
  templateUrl: './resource-refs-editor.component.html'
})
export class ResourceRefsEditorComponent {

  @Input() icon: string;
  @Input() valueTitle: string;
  @Input() state: EditorState;
  @Output('changed') changedEmitter: EventEmitter<Array<ResourceRef>> = new EventEmitter<Array<ResourceRef>>();

  resourcesUpdater: ResourcesUpdater;
  value: Array<ResourceRef>;

  @Input('resourcesUpdater')
  set setResourcesUpdater(resourcesUpdater: ResourcesUpdater) {
    this.resourcesUpdater = resourcesUpdater;
  }

  @Input('value')
  set inValue(inValue: Array<ResourceRef>) {
    this.value = inValue;
  }

  valueAsString(): string {
    return this.value && this.value.length ? this.value.map(v => v.asText()).join(', ') : '-';
  }

  itemUpdated(): void {
    this.changedEmitter.emit(this.resourcesUpdater.getSelectedResources());
  }
}
