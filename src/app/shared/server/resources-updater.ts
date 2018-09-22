import { Event, ResourceRequirement, Resource, ResourceType, ResourceTypeRef, ResourceRef, Article } from "./rest-api.model";
import { Observable } from "rxjs";
import { EventsResource } from "./events.resource";
import { ArticlesResource } from "./articles.resource";

export interface ResourcesUpdater {
  getResourceType(): ResourceType | ResourceTypeRef;
  getSelectedResources(): Array<Resource | ResourceRef>;

  removeResourceRequirement(): Observable<void>

  addResource(resource?: Resource): Observable<void>;
  removeResource(resource?: Resource): Observable<void>;

  assignPermission(): string;
  managePermission(): string;
}

export class EventResourcesUpdater implements ResourcesUpdater {

  constructor(
    private event: Event,
    private eventsResource: EventsResource,
    private rr: ResourceRequirement,
  ) {
  }

  getResourceType(): ResourceType | ResourceTypeRef {
    return this.rr.resourceType;
  }

  getSelectedResources(): Array<Resource | ResourceRef> {
    return this.rr.resources;
  }

  removeResourceRequirement(): Observable<void> {
    return this.eventsResource.removeResourceRequirement(this.event, this.rr);
  }

  addResource(resource?: Resource): Observable<void> {
    return this.eventsResource.addResource(this.event, this.rr, resource);
  }

  removeResource(resource?: Resource): Observable<void> {
    return this.eventsResource.removeResource(this.event, this.rr, resource);
  }

  assignPermission(): string {
    return this.eventsResource.assignResourceRequirementPermission(this.event, this.rr.resourceType);
  }

  managePermission(): string {
    return this.eventsResource.manageResourceRequirementsPermission(this.event, this.rr.resourceType);
  }
}

export class ArticleResourcesUpdater implements ResourcesUpdater {
  constructor(
    private article: Article,
    private authorResourceType: ResourceTypeRef,
    private articlesResource: ArticlesResource,
  ) {
  }

  getResourceType(): ResourceType | ResourceTypeRef {
    return this.authorResourceType;
  }

  getSelectedResources(): Array<Resource | ResourceRef> {
    return this.article.authors;
  }

  removeResourceRequirement(): Observable<void> {
    throw new Error("Method not implemented.");
  }

  addResource(resource?: Resource): Observable<any> {
    if (resource) {
      this.article.authors.push(resource);
    } else {
      this.article.authors.splice(0);
    }
    // Changes are sent to server from ArticleEditor::setAuthors()
    return undefined;
  }

  removeResource(resource?: Resource): Observable<any> {
    if (resource) {
      this.article.authors = this.article.authors.filter(author => author.id !== resource.id);
    } else {
      this.article.authors.splice(0);
    }
    // Changes are sent to server from ArticleEditor::setAuthors()
    return undefined;
  }

  assignPermission(): string {
    return this.articlesResource.updatePermission(this.article);
  }

  managePermission(): string {
    return this.articlesResource.updatePermission(this.article);
  }
}
