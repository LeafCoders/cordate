import { Component, OnInit } from '@angular/core';

import { BaseEditor } from '../shared/base/base-editor';
import { EditorAction } from '../shared/editor/editor-action';
import { EditorState } from '../shared/editor/editor-state';
import { AuthPermissionService, PermissionResults } from '../auth/auth-permission.service';
import { ArticleSeriesResource, ArticleSerieUpdate } from '../shared/server/article-series.resource';
import { ResourceTypesResource } from '../shared/server/resource-types.resource';

import { ArticleSerie, ResourceTypeRef } from '../shared/server/rest-api.model';

@Component({
  selector: 'lc-article-serie-editor',
  templateUrl: './article-serie-editor.component.html'
})
export class ArticleSerieEditorComponent extends BaseEditor<ArticleSerie, ArticleSerieUpdate> {

  idAliasState: EditorState = new EditorState();
  titleState: EditorState = new EditorState();
  contentState: EditorState = new EditorState();

  constructor(
    private authPermission: AuthPermissionService,
    private articleSeriesResource: ArticleSeriesResource,
  ) {
    super(articleSeriesResource);
  }

  protected allEditorStates(): Array<EditorState> {
    return [this.idAliasState, this.titleState, this.contentState];
  }

  protected checkPermissions(): void {
    const hasUpdatePermission: boolean = this.authPermission.isPermitted(this.articleSeriesResource.updatePermission(this.item));
    if (hasUpdatePermission) {
      EditorState.setAllEditable(this.allEditorStates());
    }
  }

  protected rebuildActions(): Array<EditorAction> {
    const mayDelete: boolean = this.authPermission.isPermitted(this.articleSeriesResource.deletePermission(this.item));
    let actions = [
      new EditorAction('Ta bort', mayDelete, () => this.deleteItem())
    ];
    return actions;
  }

  setIdAlias(idAlias: string): void {
    this.setValue(this.idAliasState,
      (item: ArticleSerieUpdate) => item.idAlias = idAlias,
      () => this.item.idAlias = idAlias
    );
  }

  setTitle(title: string): void {
    this.setValue(this.titleState,
      (item: ArticleSerieUpdate) => item.title = title,
      () => this.item.title = title
    );
  }

  setContent(content: string): void {
    this.setValue(this.contentState,
      (item: ArticleSerieUpdate) => item.content = content,
      () => this.item.content = content
    );
  }
}
