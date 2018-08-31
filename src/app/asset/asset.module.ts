import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';
import { AssetComponent } from './asset.component';
import { AssetListComponent } from './asset-list.component';
import { AssetEditorComponent } from './asset-editor.component';
import { AssetNewDialogComponent } from './new-dialog/asset-new-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
  ],
  declarations: [
    AssetComponent,
    AssetListComponent,
    AssetEditorComponent,
    AssetNewDialogComponent,
  ],
  entryComponents: [
    AssetNewDialogComponent,
  ],
})
export class AssetModule { }
