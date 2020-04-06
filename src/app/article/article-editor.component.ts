import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';

import { BaseEditor } from '../shared/base/base-editor';
import { EditorAction } from '../shared/editor/editor-action';
import { EditorState } from '../shared/editor/editor-state';
import { AuthPermissionService } from '../auth/auth-permission.service';
import { ArticlesResource, ArticleUpdate } from '../shared/server/articles.resource';
import { Article, Event, ArticleSerie, ResourceList, Asset, HtmlText } from '../shared/server/rest-api.model';
import { ArticleService } from './article.service';
import { ArticleResourcesUpdater } from '../shared/server/resources-updater';

@Component({
  selector: 'lc-article-editor',
  templateUrl: './article-editor.component.html'
})
export class ArticleEditorComponent extends BaseEditor<Article, ArticleUpdate> {

  articleSerieState: EditorState = new EditorState();
  eventState: EditorState = new EditorState();
  timeState: EditorState = new EditorState();
  authorsState: EditorState = new EditorState();
  titleState: EditorState = new EditorState();
  contentState: EditorState = new EditorState();
  recordingState: EditorState = new EditorState();
  recordingStatusState: EditorState = new EditorState();

  resourcesUpdater: ArticleResourcesUpdater;

  constructor(
    public viewData: ArticleService,
    private authPermission: AuthPermissionService,
    private articlesResource: ArticlesResource,
    dialog: MatDialog,
  ) {
    super(articlesResource, dialog);
  }

  protected allEditorStates(): Array<EditorState> {
    return [
      this.articleSerieState, this.eventState, this.timeState, this.authorsState,
      this.titleState, this.contentState, this.recordingState, this.recordingStatusState
    ];
  }

  protected checkPermissions(): void {
    const hasUpdateArticle: boolean = this.authPermission.isPermitted(this.articlesResource.updatePermission(this.item));
    if (hasUpdateArticle) {
      EditorState.setAllEditable(this.allEditorStates());
    }
    this.updateRecordingStatusEditable();
  }

  private updateRecordingStatusEditable(): void {
    const hasUpdateArticle: boolean = this.authPermission.isPermitted(this.articlesResource.updatePermission(this.item));
    if (this.item.recordingStatus === 'HAS_RECORDING') {
      EditorState.setEditable(this.recordingStatusState, false);
    } else {
      EditorState.setEditable(this.recordingStatusState, hasUpdateArticle);
    }
  }

  protected rebuildActions(): Array<EditorAction> {
    const mayDelete: boolean = this.authPermission.isPermitted(this.articlesResource.deletePermission(this.item));
    let actions = [
      new EditorAction('Ta bort', mayDelete, () => this.deleteItem())
    ];
    return actions;
  }

  protected afterSetEditorItem(item: Article): void {
    this.resourcesUpdater = new ArticleResourcesUpdater(item, this.viewData.articleType.authorResourceType, this.articlesResource);
  }

  setArticleSerie(articleSerie: ArticleSerie): void {
    this.setValue(this.articleSerieState,
      (item: ArticleUpdate) => item.articleSerieId = articleSerie ? articleSerie.id : undefined,
      () => this.item.articleSerie = articleSerie
    );
  }

  setEvent(event: Event): void {
    this.setValue(this.eventState,
      (item: ArticleUpdate) => item.eventId = event ? event.id : undefined,
      () => this.item.event = event
    );
  }

  setTime(time: moment.Moment): void {
    this.setValue(this.timeState,
      (item: ArticleUpdate) => item.time = time ? time.toJSON() : undefined,
      () => this.item.time = time
    );
  }

  setAuthors(authors: ResourceList): void {
    const authorIds: Array<number> = authors ? authors.map(author => author.id) : [];
    this.setValue(this.authorsState,
      (item: ArticleUpdate) => item.authorIds = authorIds,
      () => this.item.authors = authors
    );
  }

  setTitle(title: string): void {
    this.setValue(this.titleState,
      (item: ArticleUpdate) => item.title = title,
      () => this.item.title = title
    );
  }

  setContent(content: HtmlText): void {
    this.setValue(this.contentState,
      (item: ArticleUpdate) => {
        item.contentRaw = content.contentRaw;
        item.contentHtml = content.contentHtml;
      },
      () => this.item.content = content
    );
  }

  setRecording(recording: Asset): void {
    this.setValue(this.recordingState,
      (item: ArticleUpdate) => item.recordingId = recording ? recording.id : undefined,
      (updatedItem?: Article) => {
        this.item.recording = recording;
        this.item.recordingStatus = updatedItem.recordingStatus;
        this.updateRecordingStatusEditable();
      }
    );
  }

  setRecordingStatus(recordingStatus: string): void {
    this.setValue(this.recordingStatusState,
      (item: ArticleUpdate) => item.recordingStatus = recordingStatus,
      (updatedItem?: Article) => this.item.recordingStatus = updatedItem.recordingStatus
    );
  }

}
