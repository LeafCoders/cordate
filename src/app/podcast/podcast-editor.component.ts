import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { BaseEditor } from '../shared/base/base-editor';
import { EditorAction } from '../shared/editor/editor-action';
import { EditorState } from '../shared/editor/editor-state';
import { AuthPermissionService } from '../auth/auth-permission.service';
import { PodcastsResource, PodcastUpdate } from '../shared/server/podcasts.resource';

import { Podcast, Asset, ArticleTypeRef } from '../shared/server/rest-api.model';

@Component({
  selector: 'lc-podcast-editor',
  templateUrl: './podcast-editor.component.html'
})
export class PodcastEditorComponent extends BaseEditor<Podcast, PodcastUpdate> {

  articleTypeState: EditorState = new EditorState();
  idAliasState: EditorState = new EditorState();
  titleState: EditorState = new EditorState();
  subTitleState: EditorState = new EditorState();
  authorNameState: EditorState = new EditorState();
  authorEmailState: EditorState = new EditorState();
  authorLinkState: EditorState = new EditorState();
  copyrightState: EditorState = new EditorState();
  descriptionState: EditorState = new EditorState();
  mainCategoryState: EditorState = new EditorState();
  subCategoryState: EditorState = new EditorState();
  languageState: EditorState = new EditorState();
  articlesLinkState: EditorState = new EditorState();
  imageState: EditorState = new EditorState();


  constructor(
    private authPermission: AuthPermissionService,
    private podcastsResource: PodcastsResource,
    dialog: MatDialog,
  ) {
    super(podcastsResource, dialog);
  }

  protected afterSetEditorItem(item: Podcast): void {
  }

  protected allEditorStates(): Array<EditorState> {
    return [
      this.articleTypeState, this.idAliasState, this.titleState, this.subTitleState,
      this.authorNameState, this.authorEmailState, this.authorLinkState,
      this.copyrightState, this.descriptionState, this.mainCategoryState, this.subCategoryState,
      this.languageState, this.articlesLinkState, this.imageState
    ];
  }

  protected checkPermissions(): void {
    const hasUpdatePermission: boolean = this.authPermission.isPermitted(this.podcastsResource.updatePermission(this.item));
    if (hasUpdatePermission) {
      EditorState.setAllEditable(this.allEditorStates());
    }
  }

  protected rebuildActions(): Array<EditorAction> {
    const mayDelete: boolean = this.authPermission.isPermitted(this.podcastsResource.deletePermission(this.item));
    let actions = [
      new EditorAction('Ta bort', mayDelete, () => this.deleteItem())
    ];
    return actions;
  }

  setArticleType(articleType: ArticleTypeRef): void {
    this.setValue(this.articleTypeState,
      (item: PodcastUpdate) => item.articleTypeId = articleType.id,
      () => this.item.articleType = articleType
    );
  }

  setIdAlias(idAlias: string): void {
    this.setValue(this.idAliasState,
      (item: PodcastUpdate) => item.idAlias = idAlias,
      () => this.item.idAlias = idAlias
    );
  }

  setTitle(title: string): void {
    this.setValue(this.titleState,
      (item: PodcastUpdate) => item.title = title,
      () => this.item.title = title
    );
  }

  setSubTitle(subTitle: string): void {
    this.setValue(this.subTitleState,
      (item: PodcastUpdate) => item.subTitle = subTitle,
      () => this.item.subTitle = subTitle
    );
  }

  setAuthorName(authorName: string): void {
    this.setValue(this.authorNameState,
      (item: PodcastUpdate) => item.authorName = authorName,
      () => this.item.authorName = authorName
    );
  }

  setAuthorEmail(authorEmail: string): void {
    this.setValue(this.authorEmailState,
      (item: PodcastUpdate) => item.authorEmail = authorEmail,
      () => this.item.authorEmail = authorEmail
    );
  }

  setAuthorLink(authorLink: string): void {
    this.setValue(this.authorLinkState,
      (item: PodcastUpdate) => item.authorLink = authorLink,
      () => this.item.authorLink = authorLink
    );
  }

  setCopyright(copyright: string): void {
    this.setValue(this.copyrightState,
      (item: PodcastUpdate) => item.copyright = copyright,
      () => this.item.copyright = copyright
    );
  }

  setDescription(description: string): void {
    this.setValue(this.descriptionState,
      (item: PodcastUpdate) => item.description = description,
      () => this.item.description = description
    );
  }

  setMainCategory(mainCategory: string): void {
    this.setValue(this.mainCategoryState,
      (item: PodcastUpdate) => item.mainCategory = mainCategory,
      () => this.item.mainCategory = mainCategory
    );
  }

  setSubCategory(subCategory: string): void {
    this.setValue(this.subCategoryState,
      (item: PodcastUpdate) => item.subCategory = subCategory,
      () => this.item.subCategory = subCategory
    );
  }

  setLanguage(language: string): void {
    this.setValue(this.languageState,
      (item: PodcastUpdate) => item.language = language,
      () => this.item.language = language
    );
  }

  setArticlesLink(articlesLink: string): void {
    this.setValue(this.articlesLinkState,
      (item: PodcastUpdate) => item.articlesLink = articlesLink,
      () => this.item.articlesLink = articlesLink
    );
  }

  setImage(image: Asset): void {
    this.setValue(this.imageState,
      (item: PodcastUpdate) => item.imageId = image.id,
      () => this.item.image = image
    );
  }

}
