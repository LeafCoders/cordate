import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MomentModule } from 'angular2-moment';

import { SharedModule } from '../shared/shared.module';
import { AssetFolderComponent } from './asset-folder.component';
import { AssetFolderListComponent } from './asset-folder-list.component';
import { AssetFolderEditorComponent } from './asset-folder-editor.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MomentModule,
  ],
  declarations: [
    AssetFolderComponent,
    AssetFolderListComponent,
    AssetFolderEditorComponent,
  ],
  entryComponents: [],
})
export class AssetFolderModule { }
