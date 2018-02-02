import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

import { BaseEditor } from '../shared/base/base-editor';
import { EditorAction } from '../shared/editor/editor-action';
import { EditorState } from '../shared/editor/editor-state';
import { AuthPermissionService, PermissionResults } from '../auth/auth-permission.service';
import { ArticlesResource, ArticleUpdate } from '../shared/server/articles.resource';
import { GroupsResource } from '../shared/server/groups.resource';
import { UsersResource } from '../shared/server/users.resource';
import { Article, IdModel, User, ArticleSerie, ResourceList } from '../shared/server/rest-api.model';
import { ArticleService } from './article.service';

@Component({
  selector: 'lc-article-editor',
  templateUrl: './article-editor.component.html'
})
export class ArticleEditorComponent extends BaseEditor<Article, ArticleUpdate> {

  timeState: EditorState = new EditorState();
  authorsState: EditorState = new EditorState();
  titleState: EditorState = new EditorState();
  contentState: EditorState = new EditorState();
  articleSerieState: EditorState = new EditorState();

  constructor(
    public viewData: ArticleService,
    private authPermission: AuthPermissionService,
    private articlesResource: ArticlesResource,
    private groupsResource: GroupsResource,
    private usersResource: UsersResource,
  ) {
    super(articlesResource);
  }

  protected allEditorStates(): Array<EditorState> {
    return [this.timeState, this.authorsState, this.titleState, this.contentState, this.articleSerieState];
  }

  protected checkPermissions(): void {
    const hasUpdateArticle: boolean = this.authPermission.isPermitted(this.articlesResource.updatePermission(this.item));
    if (hasUpdateArticle) {
      EditorState.setAllEditable(this.allEditorStates());
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
  }

  setTime(time: moment.Moment): void {
    console.log(time.toJSON());
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

  setContent(content: string): void {
    this.setValue(this.contentState,
      (item: ArticleUpdate) => item.content = content,
      () => this.item.content = content
    );
  }

  setArticleSerie(articleSerie: ArticleSerie): void {
    this.setValue(this.articleSerieState,
      (item: ArticleUpdate) => item.articleSerieId = articleSerie ? articleSerie.id : undefined,
      () => this.item.articleSerie = articleSerie
    );
  }

}
