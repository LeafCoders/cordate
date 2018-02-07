import { Component, OnInit } from '@angular/core';

import { BaseEditor } from '../shared/base/base-editor';
import { EditorAction } from '../shared/editor/editor-action';
import { EditorState } from '../shared/editor/editor-state';
import { AuthPermissionService, PermissionResults } from '../auth/auth-permission.service';
import { ArticleTypesResource, ArticleTypeUpdate } from '../shared/server/article-types.resource';
import { UsersResource } from '../shared/server/users.resource';

import { ArticleType, User, UserList, AssetFolder, ResourceType } from '../shared/server/rest-api.model';

@Component({
  selector: 'lc-article-type-editor',
  templateUrl: './article-type-editor.component.html'
})
export class ArticleTypeEditorComponent extends BaseEditor<ArticleType, ArticleTypeUpdate> {

  idAliasState: EditorState = new EditorState();
  articlesTitleState: EditorState = new EditorState();
  newArticleTitleState: EditorState = new EditorState();
  articleSeriesTitleState: EditorState = new EditorState();
  newArticleSerieTitleState: EditorState = new EditorState();
  imageFolderState: EditorState = new EditorState();
  recordingFolderState: EditorState = new EditorState();
  authorResourceTypeState: EditorState = new EditorState();

  allUsers: UserList = [];
  usersNotInArticleType: UserList = [];

  constructor(
    private authPermission: AuthPermissionService,
    private articleTypesResource: ArticleTypesResource,
  ) {
    super(articleTypesResource);
  }

  protected allEditorStates(): Array<EditorState> {
    return [
      this.idAliasState, this.articlesTitleState, this.newArticleTitleState,
      this.articleSeriesTitleState, this.newArticleSerieTitleState,
      this.imageFolderState, this.recordingFolderState, this.authorResourceTypeState,
    ];
  }

  protected checkPermissions(): void {
    const hasUpdatePermission: boolean = this.authPermission.isPermitted(this.articleTypesResource.updatePermission(this.item));
    if (hasUpdatePermission) {
      EditorState.setAllEditable(this.allEditorStates());
    }
  }

  protected rebuildActions(): Array<EditorAction> {
    const mayDelete: boolean = this.authPermission.isPermitted(this.articleTypesResource.deletePermission(this.item));
    let actions = [
      new EditorAction('Ta bort', mayDelete, () => this.deleteItem())
    ];
    return actions;
  }

  setIdAlias(idAlias: string): void {
    this.setValue(this.idAliasState,
      (item: ArticleTypeUpdate) => item.idAlias = idAlias,
      () => this.item.idAlias = idAlias
    );
  }

  setArticlesTitle(articlesTitle: string): void {
    this.setValue(this.articlesTitleState,
      (item: ArticleTypeUpdate) => item.articlesTitle = articlesTitle,
      () => this.item.articlesTitle = articlesTitle
    );
  }

  setNewArticleTitle(newArticleTitle: string): void {
    this.setValue(this.newArticleTitleState,
      (item: ArticleTypeUpdate) => item.newArticleTitle = newArticleTitle,
      () => this.item.newArticleTitle = newArticleTitle
    );
  }

  setArticleSeriesTitle(articleSeriesTitle: string): void {
    this.setValue(this.articleSeriesTitleState,
      (item: ArticleTypeUpdate) => item.articleSeriesTitle = articleSeriesTitle,
      () => this.item.articleSeriesTitle = articleSeriesTitle
    );
  }

  setNewArticleSerieTitle(newArticleSerieTitle: string): void {
    this.setValue(this.newArticleSerieTitleState,
      (item: ArticleTypeUpdate) => item.newArticleSerieTitle = newArticleSerieTitle,
      () => this.item.newArticleSerieTitle = newArticleSerieTitle
    );
  }

  setImageFolder(imageFolder: AssetFolder): void {
    this.setValue(this.imageFolderState,
      (item: ArticleTypeUpdate) => item.imageFolderId = imageFolder.id,
      () => this.item.imageFolder = imageFolder
    );
  }

  setRecordingFolder(recordingFolder: AssetFolder): void {
    this.setValue(this.imageFolderState,
      (item: ArticleTypeUpdate) => item.recordingFolderId = recordingFolder.id,
      () => this.item.recordingFolder = recordingFolder
    );
  }

  setAuthorResourceType(authorResourceType: ResourceType): void {
    this.setValue(this.authorResourceTypeState,
      (item: ArticleTypeUpdate) => item.authorResourceTypeId = authorResourceType ? authorResourceType.id : null,
      () => this.item.authorResourceType = authorResourceType
    );
  }
}
