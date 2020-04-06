import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';

import { BaseEditor } from '../shared/base/base-editor';
import { EditorAction } from '../shared/editor/editor-action';
import { EditorState } from '../shared/editor/editor-state';
import { AuthPermissionService } from '../auth/auth-permission.service';
import { EventsResource, EventUpdate } from '../shared/server/events.resource';
import { ResourceTypesResource } from '../shared/server/resource-types.resource';
import { ArticlesResource, ArticleUpdate } from '../shared/server/articles.resource';
import { ArticleSeriesResource } from '../shared/server/article-series.resource';
import { ArticleTypesResource } from '../shared/server/article-types.resource';
import { Event, EventTypeRef, TimeRange, ResourceTypeList, ResourceRequirement, Resource, ResourceType, ArticleList, Article, ArticleType, ArticleSerie } from '../shared/server/rest-api.model';
import { SingleSelectDialogComponent } from '../shared/dialog/single-select-dialog/single-select-dialog.component';
import { SendMessageDialogService } from '../shared/dialog/send-message-dialog/send-message-dialog.service';
import { ResourcesUpdater, EventResourcesUpdater } from '../shared/server/resources-updater';

@Component({
  selector: 'lc-event-editor',
  templateUrl: './event-editor.component.html'
})
export class EventEditorComponent extends BaseEditor<Event, EventUpdate> {

  timeState: EditorState = new EditorState();
  titleState: EditorState = new EditorState();
  descriptionState: EditorState = new EditorState();
  privateDescriptionState: EditorState = new EditorState();
  eventTypeState: EditorState = new EditorState();
  isPublicState: EditorState = new EditorState();

  private currentTabIndex: number = 0;
  private resourceUpdaters: { [rrId: number]: ResourcesUpdater } = {};

  // Resouce
  private allResourceTypes: ResourceTypeList = [];
  notAddedResourceTypes: ResourceTypeList = [];
  permissionAddRequirements: boolean = false;

  // Article
  isLoadingArticles: boolean = true;
  articleCreatePermitted: boolean = false;
  articles: ArticleList = undefined;

  constructor(
    private authPermission: AuthPermissionService,
    private eventsResource: EventsResource,
    private resourceTypeResource: ResourceTypesResource,
    private articlesResource: ArticlesResource,
    private articleTypesResource: ArticleTypesResource,
    private articleSeriesResource: ArticleSeriesResource,
    private router: Router,
    private sendMessageDialogService: SendMessageDialogService,
    dialog: MatDialog,
  ) {
    super(eventsResource, dialog);

    this.resourceTypeResource.list().subscribe(resourceTypes => {
      this.allResourceTypes = resourceTypes;
      this.refreshAvailableAddResourceTypes();
    });
  }

  protected allEditorStates(): Array<EditorState> {
    return [this.timeState, this.titleState, this.descriptionState, this.privateDescriptionState, this.isPublicState, this.eventTypeState];
  }

  protected checkPermissions(): void {
    const hasUpdatePermission: boolean = this.authPermission.isPermitted(this.eventsResource.updatePermission(this.item));
    if (hasUpdatePermission) {
      EditorState.setAllEditable(this.allEditorStates());
    }
    this.articleCreatePermitted = this.authPermission.isPermitted(this.articlesResource.createPermission());
  }

  protected rebuildActions(): Array<EditorAction> {
    const mayDelete: boolean = this.authPermission.isPermitted(this.eventsResource.deletePermission(this.item));
    let actions = [
      new EditorAction('Ta bort', mayDelete, () => this.deleteItem()),
      new EditorAction('Hjälp mig', true, () => this.helpMeAction()),
    ];
    return actions;
  }

  helpMeAction(): void {
    this.sendMessageDialogService.showDialog("Hjälp mig med händelsen", `Gäller händelse: ${this.item.asText()}`);
  }

  protected afterSetEditorItem(event: Event): void {
    this.refreshAvailableAddResourceTypes();
    this.refreshArticles();
  }

  onTabSelectChange(changeEvent: MatTabChangeEvent): void {
    this.currentTabIndex = changeEvent.index;
    this.loadArticles();
  }

  addResourceRequirement(resourceType: ResourceType): void {
    if (this.item.id) {
      this.eventsResource.addResourceRequirement(this.item, resourceType).subscribe(() => {
        this.eventsResource.refreshOnlyClient();
        this.refreshAvailableAddResourceTypes();
      });
    } else {
      this.item.resourceRequirements.push(ResourceRequirement.fromResourceType(resourceType));
      this.refreshAvailableAddResourceTypes();
    }
  }

  eventResourcesUpdated(): void {
    if (this.item.id) {
      this.eventsResource.refreshOnlyClient();
      this.refreshAvailableAddResourceTypes();
    }
  }

  private refreshAvailableAddResourceTypes(): void {
    if (this.item) {
      this.notAddedResourceTypes = this.allResourceTypes.filter(resourceType => {
        if (!this.item.resourceRequirements.find((rr: ResourceRequirement) => rr.resourceType.id === resourceType.id)) {
          if (this.authPermission.isPermitted(this.eventsResource.manageResourceRequirementsPermission(this.item, resourceType))) {
            return true;
          }
        }
        return false;
      });
    }
  }

  private refreshArticles(): void {
    this.articles = undefined;
    this.isLoadingArticles = true;
    this.loadArticles();
  }

  private loadArticles(): void {
    if (this.articles === undefined && this.currentTabIndex === 2) {
      this.articles = [];
      this.eventsResource.readArticles(this.item).subscribe(articles => {
        this.isLoadingArticles = false;
        this.articles = articles;
      });
    }
  }

  navigateToArticle(article: Article): void {
    this.router.navigate([`/articles/${article.articleTypeIdAlias}`, { 'itemId': article.id }]);
  }

  showCreateArticleModal(): void {
    this.dialog.open(SingleSelectDialogComponent).componentInstance.init(
      "Välj typ av undervisning att skapa", this.articleTypesResource.listOnce(),
      (articleType: ArticleType) => {
        this.dialog.open(SingleSelectDialogComponent).componentInstance.init(
          `Välj ${articleType.articleSeriesTitle}`,
          this.articleSeriesResource.listOnceFor({ articleTypeId: articleType.id }),
          (articleSerie: ArticleSerie) => {
            let createObject: ArticleUpdate = {
              articleTypeId: articleType.id,
              articleSerieId: articleSerie.id,
              eventId: this.item.id,
              time: this.item.startTime.toJSON(),
              authorIds: this.item.resourcesOfResourceType(articleType.authorResourceType).map(r => r.id),
              title: this.item.title,
              recordingStatus: 'EXPECTING_RECORDING',
            };
            this.articlesResource.create(createObject).subscribe((article: Article) => {
              this.navigateToArticle(article);
            });
          });
      });
  }

  resourceRequirementUpdater(rr: ResourceRequirement): ResourcesUpdater {
    let updater: ResourcesUpdater = this.resourceUpdaters[rr.id];
    if (!updater) {
      updater = new EventResourcesUpdater(this.item, this.eventsResource, rr);
      this.resourceUpdaters[rr.id] = updater;
    }
    return updater;
  }

  setTime(time: TimeRange): void {
    this.setValue(this.timeState,
      (item: EventUpdate) => {
        item.startTime = time.start ? time.start.toJSON() : undefined;
        item.endTime = time.end ? time.end.toJSON() : undefined;
      },
      () => {
        this.item.startTime = time.start;
        this.item.endTime = time.end;
      }
    );
  }

  setTitle(title: string): void {
    this.setValue(this.titleState,
      (item: EventUpdate) => item.title = title,
      () => this.item.title = title
    );
  }

  setDescription(description: string): void {
    this.setValue(this.descriptionState,
      (item: EventUpdate) => item.description = description,
      () => this.item.description = description
    );
  }

  setPrivateDescription(privateDescription: string): void {
    this.setValue(this.privateDescriptionState,
      (item: EventUpdate) => item.privateDescription = privateDescription,
      () => this.item.privateDescription = privateDescription
    );
  }

  setIsPublic(isPublic: boolean): void {
    this.setValue(this.isPublicState,
      (item: EventUpdate) => item.isPublic = isPublic,
      () => this.item.isPublic = isPublic
    );
  }

  setEventType(eventType: EventTypeRef): void {
    this.setValue(this.eventTypeState,
      (item: EventUpdate) => item.eventTypeId = eventType.id,
      () => this.item.eventType = eventType
    );
  }
}
