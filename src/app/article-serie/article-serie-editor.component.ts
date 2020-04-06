import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { BaseEditor } from '../shared/base/base-editor';
import { EditorAction } from '../shared/editor/editor-action';
import { EditorState } from '../shared/editor/editor-state';
import { AuthPermissionService } from '../auth/auth-permission.service';
import { ArticleSeriesResource, ArticleSerieUpdate } from '../shared/server/article-series.resource';

import { ArticleSerie, Asset, HtmlText } from '../shared/server/rest-api.model';
import { ArticleSerieService } from './article-serie.service';

@Component({
  selector: 'lc-article-serie-editor',
  templateUrl: './article-serie-editor.component.html'
})
export class ArticleSerieEditorComponent extends BaseEditor<ArticleSerie, ArticleSerieUpdate> {

  idAliasState: EditorState = new EditorState();
  titleState: EditorState = new EditorState();
  contentState: EditorState = new EditorState();
  imageState: EditorState = new EditorState();

  constructor(
    public viewData: ArticleSerieService,
    private authPermission: AuthPermissionService,
    private articleSeriesResource: ArticleSeriesResource,
    dialog: MatDialog,
  ) {
    super(articleSeriesResource, dialog);
  }

  protected allEditorStates(): Array<EditorState> {
    return [this.idAliasState, this.titleState, this.contentState, this.imageState];
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

  setContent(content: HtmlText): void {
    this.setValue(this.contentState,
      (item: ArticleSerieUpdate) => {
        item.contentRaw = content.contentRaw;
        item.contentHtml = content.contentHtml;
      },
      () => this.item.content = content
    );
  }

  setImage(image: Asset): void {
    this.setValue(this.imageState,
      (item: ArticleSerieUpdate) => item.imageId = image ? image.id : undefined,
      () => this.item.image = image
    );
  }
}
