import { Component, Input } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';

import { BaseEditor } from '../shared/base/base-editor';
import { EditorAction } from '../shared/editor/editor-action';
import { EditorState } from '../shared/editor/editor-state';
import { AuthPermissionService } from '../auth/auth-permission.service';
import { SlidesResource, SlideUpdate } from '../shared/server/slides.resource';

import { Asset, Slide, SlideShow, TimeRange } from '../shared/server/rest-api.model';
import { SingleSelectDialogComponent } from '../shared/dialog/single-select-dialog/single-select-dialog.component';
import { SlideShowsResource } from '../shared/server/slide-shows.resource';

@Component({
  selector: 'lc-slide-editor',
  templateUrl: './slide-editor.component.html'
})
export class SlideEditorComponent extends BaseEditor<Slide, SlideUpdate> {

  titleState: EditorState = new EditorState();
  timeState: EditorState = new EditorState();
  durationState: EditorState = new EditorState();
  imageState: EditorState = new EditorState();

  slideShow: SlideShow;

  @Input('slideShow')
  set setSlideShow(slideShow: SlideShow) {
    this.slideShow = slideShow;
  }

  constructor(
    private authPermission: AuthPermissionService,
    private slidesResource: SlidesResource,
    private slideShowsResource: SlideShowsResource,
    private snackBar: MatSnackBar,
    dialog: MatDialog,
  ) {
    super(slidesResource, dialog);
  }

  protected allEditorStates(): Array<EditorState> {
    return [this.titleState, this.timeState, this.durationState, this.imageState];
  }

  protected checkPermissions(): void {
    const hasUpdatePermission: boolean = this.authPermission.isPermitted(this.slidesResource.updatePermission(this.item));
    if (hasUpdatePermission) {
      EditorState.setAllEditable(this.allEditorStates());
    }
  }

  protected rebuildActions(): Array<EditorAction> {
    const mayDelete: boolean = this.authPermission.isPermitted(this.slidesResource.deletePermission(this.item));
    let actions = [
      new EditorAction('Ta bort', mayDelete, () => this.deleteItem()),
      new EditorAction('Kopiera till...', true, () => this.copyItemTo()),
    ];
    return actions;
  }

  private copyItemTo(): void {
    this.dialog.open(SingleSelectDialogComponent).componentInstance.init(
      "Välj bildspel att kopiera till", this.slideShowsResource.listOnce(),
      (slideShow: SlideShow) => {
        let slideCopy: SlideUpdate = {
          id: undefined,
          title: this.item.title,
          startTime: this.item.startTime.toJSON(),
          endTime: this.item.endTime.toJSON(),
          duration: this.item.duration,
          imageId: this.item.image.id,
        };
        this.slidesResource.create(slideCopy, slideShow.id).subscribe(slide => {
          this.slidesResource.refreshList(true);
          this.snackBar.open('Koperiat!', 'OK', { duration: 4000 });
        });
      });
  }

  setTitle(title: string): void {
    this.setValue(this.titleState,
      (item: SlideUpdate) => item.title = title,
      () => this.item.title = title
    );
  }

  setTime(time: TimeRange): void {
    this.setValue(this.timeState,
      (item: SlideUpdate) => {
        item.startTime = time.start ? time.start.toJSON() : undefined;
        item.endTime = time.end ? time.end.toJSON() : undefined;
      },
      () => {
        this.item.startTime = time.start;
        this.item.endTime = time.end;
      }
    );
  }

  setDuration(duration: number): void {
    this.setValue(this.durationState,
      (item: SlideUpdate) => item.duration = duration,
      () => this.item.duration = duration
    );
  }

  setImage(image: Asset): void {
    this.setValue(this.imageState,
      (item: SlideUpdate) => item.imageId = image.id,
      () => this.item.image = image
    );
    if (!this.item.title) {
      const title: string = image.fileName.split('.')[0];
      this.setTitle(title);
      this.item.title = title;
    }
  }
}
