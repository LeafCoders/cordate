import * as moment from 'moment';

type Input<T> = { readonly [P in keyof T]?: T[P]; }
//type Input = { [key: string]: Object };

export type AnyModel = IdModel | TypeModel;

type ModelConstructor<T> = { new(data: any, clazz?: any): T };

function readValue(thiz: any, data: any, name: string): void {
  thiz[name] = data[name];
}

function readDate(thiz: any, data: any, name: string): void {
  thiz[name] = data[name] ? moment(data[name].substr(0, 16)) : undefined;
}

function readObject<T>(thiz: any, data: any, name: string, clazz: ModelConstructor<T>, clazz2?: ModelConstructor<any>): void {
  let objectData: any = data[name];
  if (objectData instanceof IdModel) {
    objectData = objectData.rawData;
  } else if (objectData instanceof TypeModel) {
    objectData = objectData.rawData;
  }
  thiz[name] = objectData ? new clazz(objectData, clazz2) : undefined;
}

function readArrayWithFn<T>(thiz: any, data: any, name: string, constructFn: Function): void {
  if (data[name]) {
    thiz[name] = data[name].map((item: T) => constructFn(item)).filter((item: T) => item);
  } else {
    thiz[name] = [];
  }
}

function readArray<T>(thiz: any, data: any, name: string, clazz: ModelConstructor<T>, clazz2?: ModelConstructor<any>): void {
  readArrayWithFn<T>(thiz, data, name, function (item) {
    return new clazz(item, clazz2);
  });
}

export interface TimeRange {
  start: moment.Moment;
  end: moment.Moment;
}

export interface HtmlText {
  contentRaw: string;
  contentHtml: string;
}

export interface Selectable<MODEL extends IdModel> {
  selected: boolean;
  value: MODEL;
}

export interface HasParent<PARENT extends IdModel, CHILD extends IdModel> {
  setParent(parent: PARENT): CHILD;
}

export interface HasDisplayOrder {
  displayOrder: number;
}

export abstract class IdModel {
  rawData: any;
  id: number;

  constructor(data: Input<IdModel>) {
    this.rawData = data;
    this.id = data ? data.id : undefined;
  }

  static idOf(idModel: IdModel): number {
    return idModel ? idModel.id : undefined;
  }

  static idEquals(idOrModel: number | IdModel): (IdModel) => boolean {
    if (typeof idOrModel === 'number') {
      return (model: IdModel) => model && model.id === idOrModel;
    }
    return (model: IdModel) => model && model.id === (<IdModel>idOrModel).id;
  }

  static restOf<T extends IdModel>(all: Array<T>, someOfAll: Array<T>): Array<T> {
    return all.filter((item: T) => !someOfAll.some(IdModel.idEquals(item)));
  }

  idEquals(model: IdModel): boolean {
    return model && model.id === this.id;
  }

  mergeWith(model: IdModel): void {
    for (let attr in model) {
      if (model[attr] !== undefined) {
        this[attr] = model[attr];
      }
    }
  }

  abstract asText(): string;
}

export abstract class TypeModel {
  rawData: any;
  type: string;

  constructor(data: Input<TypeModel>) {
    this.rawData = data;
    this.type = data ? data.type : undefined;
  }

  abstract asText(): string;
}

export class Slide extends IdModel implements HasParent<SlideShow, Slide>, HasDisplayOrder {
  title: string;
  startTime: moment.Moment;
  endTime: moment.Moment;
  duration: number;
  image: Asset;
  displayOrder: number;

  slideShow: SlideShow;

  constructor(data: Input<Slide>) {
    super(data);
    readValue(this, data, 'title');
    readDate(this, data, 'startTime');
    readDate(this, data, 'endTime');
    readValue(this, data, 'duration');
    readObject<Asset>(this, data, 'image', Asset);
    readValue(this, data, 'displayOrder');
  }

  setParent(parent: SlideShow): Slide {
    this.slideShow = parent;
    return this;
  }

  asText(): string {
    return this.title;
  }

  isBeforeActive(): boolean {
    return this.startTime && this.startTime.isAfter();
  }

  isAfterActive(): boolean {
    return this.endTime && this.endTime.isBefore();
  }

  isActive(): boolean {
    return !this.isBeforeActive() && !this.isAfterActive();
  }

  updateObject(): Slide {
    return new Slide({ id: this.id }).setParent(this.slideShow);
  }

  toJSON(): any {
    return {
      id: this.id,
      title: this.title,
      startTime: this.startTime,
      endTime: this.endTime,
      duration: this.duration,
      imageId: IdModel.idOf(this.image)
    };
  }
}

export declare type SlideList = Array<Slide>;

export class SlideShow extends IdModel {
  idAlias: string;
  name: string;
  assetFolder: AssetFolder;
  slides: SlideList;

  constructor(data: Input<SlideShow>) {
    super(data);
    readValue(this, data, 'idAlias');
    readValue(this, data, 'name');
    readObject<AssetFolder>(this, data, 'assetFolder', AssetFolder);
    readArrayWithFn<Slide>(this, data, 'slides', (data) => new Slide(data).setParent(this));
  }

  asText(): string {
    return this.name;
  }

  updateObject(): SlideShow {
    return new SlideShow({ id: this.id });
  }
}

export declare type SlideShowList = Array<SlideShow>;

export class Event extends IdModel {
  eventType: EventTypeRef;
  startTime: moment.Moment;
  endTime: moment.Moment;
  title: string;
  description: string;
  privateDescription: string;
  isPublic: boolean;
  resourceRequirements: Array<ResourceRequirement>;

  constructor(data: Input<Event>) {
    super(data);
    readObject<EventTypeRef>(this, data, 'eventType', EventTypeRef);
    readDate(this, data, 'startTime');
    readDate(this, data, 'endTime');
    readValue(this, data, 'title');
    readValue(this, data, 'description');
    readValue(this, data, 'privateDescription');
    readValue(this, data, 'isPublic');
    readArray<ResourceRequirement>(this, data, 'resourceRequirements', ResourceRequirement);
  }

  static createForEventType(eventType: EventType, date: moment.Moment): Event {
    let event: Event = new Event({});
    event.eventType = eventType;
    event.startTime = date.clone().hour(11);
    event.endTime = date.clone().hour(13);
    event.title = eventType.name;
    event.isPublic = eventType.isPublic;
    return event;
  }

  resourcesOfResourceType(resourceType: ResourceTypeRef): Array<ResourceRef> {
    let rr = this.resourceRequirements.find(rr => rr.resourceType.idEquals(resourceType));
    return rr ? rr.resources : [];
  }

  asText(): string {
    return this.startTime.format('YYYY-MM-DD HH:mm') + ' - ' + this.title;
  }

  updateObject(): Event {
    return new Event({ id: this.id });
  }

  asRef(): EventRef {
    return new EventRef(this.rawData);
  }

  toJSON(): any {
    return {
      id: this.id,
      startTime: this.startTime,
      endTime: this.endTime,
      title: this.title,
      description: this.description,
      isPublic: this.isPublic,
      eventTypeId: IdModel.idOf(this.eventType),
    };
  }
}

export declare type EventList = Array<Event>;

export class EventRef extends IdModel {
  title: string;
  startTime: moment.Moment;

  constructor(data: Input<EventRef>) {
    super(data);
    readValue(this, data, 'title');
    readDate(this, data, 'startTime');
  }

  asText(): string {
    return this.startTime.format('YYYY-MM-DD HH:mm') + ' - ' + this.title;
  }
}


export class EventType extends IdModel {
  idAlias: string;
  name: string;
  description: string;
  isPublic: boolean;
  resourceTypes: Array<ResourceTypeRef>;

  constructor(data: Input<EventType>) {
    super(data);
    readValue(this, data, 'idAlias');
    readValue(this, data, 'name');
    readValue(this, data, 'description');
    readValue(this, data, 'isPublic');
    readArray(this, data, 'resourceTypes', ResourceTypeRef);
  }

  asText(): string {
    return this.name;
  }
}

export class EventTypeRef extends IdModel {
  name: string;

  constructor(data: Input<EventTypeRef>) {
    super(data);
    readValue(this, data, 'name');
  }

  asText(): string {
    return this.name;
  }
}

export declare type EventTypeList = Array<EventType>;


export class Location extends IdModel {
  name: string;
  description: string;

  constructor(data: Input<Location>) {
    super(data);
    readValue(this, data, 'name');
    readValue(this, data, 'description');
  }

  asText(): string {
    return this.name;
  }
}

export declare type LocationList = Array<Location>;

export class LocationRef extends IdModel {
  name: string;

  constructor(data: Input<LocationRef>) {
    super(data);
    readValue(this, data, 'name');
  }

  asText(): string {
    return this.name;
  }
}

export class ResourceRequirement extends IdModel {
  resourceType: ResourceTypeRef;
  resources: Array<ResourceRef>;

  constructor(data: Input<ResourceRequirement>) {
    super(data);
    readObject<ResourceTypeRef>(this, data, 'resourceType', ResourceTypeRef);
    readArray<ResourceRef>(this, data, 'resources', ResourceRef);
  }

  static fromResourceType(resourceType: ResourceTypeRef): ResourceRequirement {
    let rr: ResourceRequirement = new ResourceRequirement({});
    rr.resourceType = resourceType;
    return rr;
  }

  asText(): string {
    if (this.resources && this.resources.length) {
      return this.resources.map(r => r.asText()).join(', ');
    } else {
      return '-';
    }
  }
}


export class Resource extends IdModel {
  name: string;
  description: string;
  lastUseTime: moment.Moment;
  resourceTypes: Array<ResourceTypeRef>;
  user: UserRef;

  constructor(data: Input<Resource>) {
    super(data);
    readValue(this, data, 'name');
    readValue(this, data, 'description');
    readDate(this, data, 'lastUseTime');
    readArray<ResourceTypeRef>(this, data, 'resourceTypes', ResourceTypeRef);
    readObject<UserRef>(this, data, 'user', UserRef);
  }

  compareTo(resource: Resource): number {
    if (this.lastUseTime && resource.lastUseTime) {
      return this.lastUseTime.isBefore(resource.lastUseTime) ? -1 : 1;
    }
    return this.lastUseTime ? -1 : 1;
  }

  asText(): string {
    return this.name;
  }

  asRef(): ResourceRef {
    return new ResourceRef(this.rawData);
  }
}

export declare type ResourceList = Array<Resource>;

export class ResourceRef extends IdModel {
  name: string;
  user: UserRef;

  constructor(data: Input<ResourceRef>) {
    super(data);
    readValue(this, data, 'name');
    readObject<UserRef>(this, data, 'user', UserRef);
  }

  static from(item: Resource): ResourceRef {
    let ref: ResourceRef = new ResourceRef({});
    ref.id = item.id;
    ref.name = item.name;
    ref.user = item.user;
    return ref;
  }

  asText(): string {
    return this.name;
  }
}



export class ResourceType extends IdModel {
  idAlias: string;
  name: string;
  description: string;
  displayOrder: number;

  constructor(data: Input<ResourceType>) {
    super(data);
    readValue(this, data, 'idAlias');
    readValue(this, data, 'name');
    readValue(this, data, 'description');
    readValue(this, data, 'displayOrder');
  }

  asText(): string {
    return this.name;
  }

  asRef(): ResourceTypeRef {
    return new ResourceTypeRef(this.rawData);
  }
}

export class ResourceTypeRef extends IdModel {
  name: string;
  displayOrder: number;

  constructor(data: Input<ResourceTypeRef>) {
    super(data);
    readValue(this, data, 'name');
    readValue(this, data, 'displayOrder');
  }

  asText(): string {
    return this.name;
  }
}

export declare type ResourceTypeList = Array<ResourceType>;


export class User extends IdModel {
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  lastLoginTime: moment.Moment;

  constructor(data: Input<User>) {
    super(data);
    readValue(this, data, 'email');
    readValue(this, data, 'firstName');
    readValue(this, data, 'lastName');
    readValue(this, data, 'isActive');
    readDate(this, data, 'lastLoginTime');
  }

  asText(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  asRef(): UserRef {
    return new UserRef(this.rawData);
  }
}

export class UserRef extends IdModel {
  firstName: string;
  lastName: string;

  fullName: string;

  constructor(data: Input<UserRef>) {
    super(data);
    readValue(this, data, 'firstName');
    readValue(this, data, 'lastName');

    this.fullName = `${this.firstName} ${this.lastName}`;
  }

  asText(): string {
    return this.fullName;
  }
}

export declare type UserList = Array<User>;
export declare type UserRefList = Array<UserRef>;


export class Group extends IdModel {
  idAlias: string;
  name: string;
  description: string;
  users: UserList;

  constructor(data: Input<Group>) {
    super(data);
    readValue(this, data, 'idAlias');
    readValue(this, data, 'name');
    readValue(this, data, 'description');
    readArray(this, data, 'users', User);
  }

  asText(): string {
    return this.name;
  }
}

export declare type GroupList = Array<Group>;


export class Asset extends IdModel implements HasParent<AssetFolder, Asset> {
  type: string;
  mimeType: string;
  fileName: string;
  url: string;

  isImageFile: boolean;
  isAudioFile: boolean;
  isTextFile: boolean;

  fileSize: number;
  width: number;
  height: number;
  duration: number;

  assetFolder: AssetFolder;


  constructor(data: Input<Asset>) {
    super(data);
    readValue(this, data, 'type');
    readValue(this, data, 'mimeType');
    readValue(this, data, 'fileName');
    readValue(this, data, 'url');
    readValue(this, data, 'isImageFile');
    readValue(this, data, 'isAudioFile');
    readValue(this, data, 'isTextFile');
    readValue(this, data, 'fileSize');
    readValue(this, data, 'width');
    readValue(this, data, 'height');
    readValue(this, data, 'duration');
  }

  setParent(parent: AssetFolder): Asset {
    this.assetFolder = parent;
    return this;
  }

  asText(): string {
    return this.fileName;
  }

  isTypeUrl(): boolean {
    return this.type === 'URL';
  }

  isNotSupported(): boolean {
    return !(this.isTypeUrl() || this.isImageFile || this.isAudioFile || this.isTextFile);
  }

  iconUrl(): string {
    return `${this.url}?size=icon`;
  }

  fileSizeString(): string {
    if (this.fileSize >= (1024 * 1024)) {
      return `${Math.floor(10 * this.fileSize / (1024 * 1024)) / 10} MB`;
    }
    if (this.fileSize >= 1024) {
      return `${Math.floor(10 * this.fileSize / 1024) / 10} KB`;
    }
    return `${this.fileSize} B`;
  }

  durationString(): string {
    let hours: number = Math.floor(this.duration / 3600);
    let minutes: number = Math.floor((this.duration - 3600 * hours) / 60);
    let seconds: number = this.duration - 3600 * hours - 60 * minutes;
    if (hours) return `${hours}:${minutes}:${seconds}`;
    if (minutes) return `${minutes}:${seconds}`;
    return `${seconds}`;
  }
}

export declare type AssetList = Array<Asset>;


export class AssetFolder extends IdModel {
  idAlias: string;
  name: string;
  description: string;
  allowedMimeTypes: string;
  staticFileKey: boolean;

  constructor(data: Input<AssetFolder>) {
    super(data);
    readValue(this, data, 'idAlias');
    readValue(this, data, 'name');
    readValue(this, data, 'description');
    readValue(this, data, 'allowedMimeTypes');
    readValue(this, data, 'staticFileKey');
  }

  asText(): string {
    return this.name;
  }
}

export declare type AssetFolderList = Array<AssetFolder>;

export class AssetFolderRef extends IdModel {
  name: string;

  constructor(data: Input<AssetFolderRef>) {
    super(data);
    readValue(this, data, 'name');
  }

  asText(): string {
    return this.name;
  }
}


export class TextValue extends IdModel {
  format: string;
  isPublic: boolean;
  value: string;

  constructor(data: Input<TextValue>) {
    super(data);
    readValue(this, data, 'format');
    readValue(this, data, 'isPublic');
    readValue(this, data, 'value');
  }

  asText(): string {
    return this.id.toString();
  }

  updateObject(): TextValue {
    return new TextValue({ id: this.id });
  }
}

export declare type TextValueList = Array<TextValue>;

export enum PermissionLevel {
  PUBLIC = 0,
  ALL_USERS = 1,
  ONE_GROUP = 2,
  ONE_USER = 3
}

export class Permission extends IdModel {
  name: string;
  level: PermissionLevel;
  entity: IdModel;
  patterns: string;
  permissionSets: Array<PermissionSetRef>;

  constructor(data: Input<Permission & { entityId: number }>) {
    super(data);
    readValue(this, data, 'name');
    readValue(this, data, 'level');
    readValue(this, data, 'patterns');
    if (this.isLevel(PermissionLevel.ONE_GROUP)) {
      this.entity = data.entityId ? new Group({ id: data.entityId }) : undefined;
    } else if (this.isLevel(PermissionLevel.ONE_USER)) {
      this.entity = data.entityId ? new User({ id: data.entityId }) : undefined;
    }
    readArray<PermissionSetRef>(this, data, 'permissionSets', PermissionSetRef);
  }

  asText(): string {
    return this.name;
  }

  isLevel(level: PermissionLevel): boolean {
    return this.level === level;
  }
}

export declare type PermissionList = Array<Permission>;


export class PermissionSet extends IdModel {
  name: string;
  patterns: string;

  constructor(data: Input<PermissionSet>) {
    super(data);
    readValue(this, data, 'name');
    readValue(this, data, 'patterns');
  }

  asText(): string {
    return this.name;
  }

  asRef(): PermissionSetRef {
    return new PermissionSetRef(this.rawData);
  }
}

export class PermissionSetRef extends IdModel {
  name: string;

  constructor(data: Input<PermissionSetRef>) {
    super(data);
    readValue(this, data, 'name');
  }

  asText(): string {
    return this.name;
  }
}

export declare type PermissionSetList = Array<PermissionSet>;
export declare type PermissionSetRefList = Array<PermissionSetRef>;


export class ArticleType extends IdModel {
  idAlias: string;
  articlesTitle: string;
  newArticleTitle: string;
  articleSeriesTitle: string;
  newArticleSerieTitle: string;
  imageFolder: AssetFolder;
  recordingFolder: AssetFolder;
  defaultRecordingStatus: string;
  authorResourceType: ResourceTypeRef;

  constructor(data: Input<ArticleType>) {
    super(data);
    readValue(this, data, 'idAlias');
    readValue(this, data, 'articlesTitle');
    readValue(this, data, 'newArticleTitle');
    readValue(this, data, 'articleSeriesTitle');
    readValue(this, data, 'newArticleSerieTitle');
    readObject<AssetFolder>(this, data, 'imageFolder', AssetFolder);
    readObject<AssetFolder>(this, data, 'recordingFolder', AssetFolder);
    readValue(this, data, 'defaultRecordingStatus');
    readObject<ResourceTypeRef>(this, data, 'authorResourceType', ResourceTypeRef);
  }

  asText(): string {
    return this.articlesTitle;
  }
}

export class ArticleTypeRef extends IdModel {
  articlesTitle: string;

  constructor(data: Input<ArticleTypeRef>) {
    super(data);
    readValue(this, data, 'articlesTitle');
  }

  asText(): string {
    return this.articlesTitle;
  }
}

export declare type ArticleTypeList = Array<ArticleType>;


export class ArticleSerie extends IdModel {
  articleTypeId: number;
  idAlias: string;
  title: string;
  contentRaw: string;
  contentHtml: string;
  image: Asset;
  lastUseTime: moment.Moment;

  // Calculated
  content: HtmlText;

  constructor(data: Input<ArticleSerie>) {
    super(data);
    readValue(this, data, 'articleTypeId');
    readValue(this, data, 'idAlias');
    readValue(this, data, 'title');
    readValue(this, data, 'contentRaw');
    readValue(this, data, 'contentHtml');
    readObject<Asset>(this, data, 'image', Asset);
    readDate(this, data, 'lastUseTime');

    this.content = { contentRaw: this.contentRaw, contentHtml: this.contentHtml };
  }

  compareTo(articleSerie: ArticleSerie): number {
    if (this.lastUseTime && articleSerie.lastUseTime) {
      return this.lastUseTime.isAfter(articleSerie.lastUseTime) ? -1 : 1;
    } else if (this.lastUseTime) {
      return -1;
    } else if (articleSerie.lastUseTime) {
      return 1;
    }
    return this.title.localeCompare(articleSerie.title);
  }

  asText(): string {
    return this.title;
  }

  asRef(): ArticleSerieRef {
    return new ArticleSerieRef(this.rawData);
  }
}

export class ArticleSerieRef extends IdModel {
  articleTypeId: number;
  title: string;

  constructor(data: Input<ArticleSerieRef>) {
    super(data);
    readValue(this, data, 'articleTypeId');
    readValue(this, data, 'title');
  }

  asText(): string {
    return this.title;
  }
}

export declare type ArticleSerieList = Array<ArticleSerie>;
export declare type ArticleSerieRefList = Array<ArticleSerieRef>;


export class Article extends IdModel {
  articleTypeId: number;
  articleTypeIdAlias: string;
  articleSerie: ArticleSerieRef;
  event: EventRef;
  lastModifiedTime: moment.Moment;
  time: moment.Moment;
  authors: Array<ResourceRef>;
  title: string;
  contentRaw: string;
  contentHtml: string;
  recording: Asset;
  recordingStatus: string;

  // Calculated
  content: HtmlText;

  constructor(data: Input<Article>) {
    super(data);
    readValue(this, data, 'articleTypeId');
    readValue(this, data, 'articleTypeIdAlias');
    readObject<ArticleSerieRef>(this, data, 'articleSerie', ArticleSerieRef);
    readObject<EventRef>(this, data, 'event', EventRef);
    readDate(this, data, 'lastModifiedTime');
    readDate(this, data, 'time');
    readArray<ResourceRef>(this, data, 'authors', ResourceRef);
    readValue(this, data, 'title');
    readValue(this, data, 'contentRaw');
    readValue(this, data, 'contentHtml');
    readObject<Asset>(this, data, 'recording', Asset);
    readValue(this, data, 'recordingStatus');

    this.content = { contentRaw: this.contentRaw, contentHtml: this.contentHtml };
  }

  asText(): string {
    const timeString: string = this.time ? this.time.format('YYYY-MM-DD') : '';
    return timeString + ' - ' + this.title;
  }
}

export declare type ArticleList = Array<Article>;


export class Message extends IdModel {
  key: string;
  message: string;

  constructor(data: Input<Message>) {
    super(data);
    readValue(this, data, 'key');
    readValue(this, data, 'message');
  }

  asText(): string {
    return this.key;
  }
}

export declare type MessageList = Array<Message>;


export class Podcast extends IdModel {
  articleType: ArticleTypeRef;
  idAlias: string;
  title: string;
  subTitle: string;
  authorName: string;
  authorEmail: string;
  authorLink: string;
  copyright: string;
  description: string;
  mainCategory: string;
  subCategory: string;
  language: string;
  articlesLink: string;
  image: Asset;

  constructor(data: Input<Podcast>) {
    super(data);
    readObject<ArticleTypeRef>(this, data, 'articleType', ArticleTypeRef);
    readValue(this, data, 'idAlias');
    readValue(this, data, 'title');
    readValue(this, data, 'subTitle');
    readValue(this, data, 'authorName');
    readValue(this, data, 'authorEmail');
    readValue(this, data, 'authorLink');
    readValue(this, data, 'copyright');
    readValue(this, data, 'description');
    readValue(this, data, 'mainCategory');
    readValue(this, data, 'subCategory');
    readValue(this, data, 'language');
    readValue(this, data, 'articlesLink');
    readObject<Asset>(this, data, 'image', Asset);
  }

  asText(): string {
    return this.title;
  }
}

export declare type PodcastList = Array<Podcast>;
