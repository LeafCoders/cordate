import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSelectionListChange } from '@angular/material/list';
import { FormControl } from '@angular/forms';

import { Selectable, IdModel, ArticleSerie } from '../../server/rest-api.model';
import { ArticleSeriesResource } from '../../server/article-series.resource';
import { ArticleTypesResource } from '../../server/article-types.resource';
import { AssetFoldersResource } from '../../server/asset-folders.resource';
import { EventTypesResource } from '../../server/event-types.resource';
import { GroupsResource } from '../../server/groups.resource';
import { ResourceTypesResource } from '../../server/resource-types.resource';
import { SlideShowsResource } from '../../server/slide-shows.resource';
import { UsersResource } from '../../server/users.resource';

interface Item {
  id: number;
  title: string;
  selected?: boolean;
}

interface TypeOption extends Item {
  pattern: String;
  disabled?: boolean;
}

@Component({
  selector: 'lc-permission-wizard-dialog',
  templateUrl: './permission-wizard-dialog.component.html',
  styleUrls: ['./permission-wizard-dialog.component.scss']
})
export class PermissionWizardDialogComponent {

  permissionTypeOptions: Array<TypeOption> = [];
  selectedPermissionType: TypeOption;

  private currentStep: number = 0;
  private itemTypesToSelect: Array<string> = [];
  private selectedIds: Array<number> = [];

  // Search field
  searchCtrl: FormControl = new FormControl();
  noItemsFound: boolean = false;

  // Step data
  stepTitle: string = 'Välj behörighetsmall';
  allItems: Array<Item>;
  items: Array<Item>;
  allowMultiSelect: boolean = false;
  nextButtonText: string = '';
  nextButtonEnabled: boolean = false;

  constructor(
    private articleSeriesResource: ArticleSeriesResource,
    private articleTypesResource: ArticleTypesResource,
    private assetFoldersResource: AssetFoldersResource,
    private eventTypesResource: EventTypesResource,
    private groupsResource: GroupsResource,
    private resourceTypesResource: ResourceTypesResource,
    private slideShowsResource: SlideShowsResource,
    private usersResource: UsersResource,
    public dialogRef: MatDialogRef<PermissionWizardDialogComponent>,
  ) {
    this.addOptionType('Admin - Allt', '*');
    this.addOptionType('Admin - Konfigurera användare, grupper och resurser', 'users,groups,resources');
    this.addOptionType('Händelser - Se alla', 'events:view/read');
    this.addOptionType('Händelser - Administrera', 'events:*');
    this.addOptionType('Händelser - Administrera event av typ...', 'eventTypes:createEvents/readEvents/updateEvents/deleteEvents:{eventType}');
    this.addOptionType('Händelser - Tilldela alla resursbehov', 'events:view,resourceTypes:read,resources:read,resourceTypes:assignEventResources');
    this.addOptionType('Händelser - Tilldela resursbehov...', 'events:view,resourceTypes:read,resources:read,resourceTypes:assignEventResources:{resourceType}');
    this.addOptionType('Bildspel - Administrera', 'slideShows,slides');
    this.addOptionType('Bildspel - Se alla', 'slideShows:read,assets:read');
    this.addOptionType('Bildspel - Se bildspel...', 'slideShows:read:{slideShow},assets:read');
    this.addOptionType('Publikt - Standard', 'articles:public,events:public,podcasts:public,slideShows:public');

    this.searchCtrl.valueChanges.subscribe(value => {
      this.items = this.allItems.filter(item => !value || item.title.toLowerCase().includes(value.toLowerCase()));
      this.noItemsFound = this.items.length === 0;
    });

    this.setItems(this.permissionTypeOptions);
  }

  selectedItemChanged(event: MatSelectionListChange): void {
    this.toggleSelect(event.option.value);

    const selectedItem: Item = this.getSelectedItem();
    if (this.currentStep === 0 && selectedItem) {
      this.selectedPermissionType = this.permissionTypeOptions.find(pto => pto.id === selectedItem.id);
      const regExpMatch: RegExpMatchArray = this.selectedPermissionType.pattern.match(/{\w+}/);
      this.itemTypesToSelect = regExpMatch ? regExpMatch.map(entry => entry.replace('{', '').replace('}', '')) : [];
    }
    if (this.currentStep === this.itemTypesToSelect.length) {
      this.nextButtonText = 'INFOGA';
    } else {
      this.nextButtonText = 'NÄSTA';
    }
    this.nextButtonEnabled = !!selectedItem;
  }

  next(): void {
    this.searchCtrl.reset();
    if (this.currentStep > 0) {
      this.selectedIds.push(this.getSelectedItem().id);
    }
    if (this.currentStep < this.itemTypesToSelect.length) {
      this.currentStep++;
      this.setupNextStep();
    } else {
      const pattern: string = this.selectedPermissionType.pattern.split(/{\w+}/).map((s: string, index: number) => {
        if (index < this.itemTypesToSelect.length) {
          return s + this.selectedIds[index];
        } else {
          return s;
        }
      }).join('');
      this.dialogRef.close(pattern);
    }
  }

  private setupNextStep(): void {
    switch (this.itemTypesToSelect[this.currentStep - 1]) {
      case 'articleSerie':
        this.articleSeriesResource.listOnce().subscribe((refs: Array<ArticleSerie>) => {
          this.setItemsFromIdModel(refs.sort((a, b) => a.compareTo(b)));
        });
        this.stepTitle = 'Välj artikelserie';
        break;
      case 'articleType':
        this.articleTypesResource.listOnce().subscribe(this.setItemsFromIdModel.bind(this));
        this.stepTitle = 'Välj artikeltyp';
        break;
      case 'assetFolder':
        this.assetFoldersResource.listOnce().subscribe(this.setItemsFromIdModel.bind(this));
        this.stepTitle = 'Välj filkatalog';
        break;
      case 'eventType':
        this.eventTypesResource.listOnce().subscribe(this.setItemsFromIdModel.bind(this));
        this.stepTitle = 'Välj händelsetyp';
        break;
      case 'group':
        this.groupsResource.listOnce().subscribe(this.setItemsFromIdModel.bind(this));
        this.stepTitle = 'Välj grupp';
        break;
      case 'resourceType':
        this.resourceTypesResource.listOnce().subscribe(this.setItemsFromIdModel.bind(this));
        this.stepTitle = 'Välj resurstyp';
        break;
      case 'slideShow':
        this.slideShowsResource.listOnce().subscribe(this.setItemsFromIdModel.bind(this));
        this.stepTitle = 'Välj bildspel';
        break;
      case 'user':
        this.usersResource.listOnce().subscribe(this.setItemsFromIdModel.bind(this));
        this.stepTitle = 'Välj användare';
        break;
    }

    this.nextButtonEnabled = false;
    if (this.currentStep === this.itemTypesToSelect.length) {
      this.nextButtonText = 'INFOGA';
    }
  }

  private setItems(refs: Array<Item>): void {
    this.allItems = refs.slice();
    this.items = this.allItems.slice();
  };

  private setItemsFromIdModel(refs: Array<IdModel>): void {
    this.allItems = refs.map(r => <Item>{ id: r.id, title: r.asText(), selected: false });
    this.items = this.allItems.slice();
  };

  private toggleSelect(select: Selectable<IdModel>): void {
    if (this.allowMultiSelect) {
      select.selected = !select.selected;
    } else {
      this.selectNone();
      select.selected = true;
    }
  }

  private selectNone(): void {
    this.allItems.forEach((s: Item) => s.selected = false);
  }

  private getSelectedItem(): Item {
    return this.allItems.find(i => i.selected);
  }

  private addOptionType(title: string, pattern: string): void {
    this.permissionTypeOptions.push({ id: this.permissionTypeOptions.length + 1, title, pattern });
  }
}
