import { Component } from '@angular/core';

import { BaseList } from '../shared/base/base-list';
import { AuthPermissionService } from '../auth/auth-permission.service';
import { AssetFoldersResource } from '../shared/server/asset-folders.resource';
import { AssetFolder, AssetFolderList } from '../shared/server/rest-api.model';

@Component({
  selector: 'lc-asset-folder-list',
  templateUrl: './asset-folder-list.component.html'
})
export class AssetFolderListComponent extends BaseList<AssetFolder> {

  constructor(
    private assetFoldersResource: AssetFoldersResource,
    private authPermission: AuthPermissionService,
  ) {
    super(assetFoldersResource, () => assetFoldersResource.list());
  }

  protected init(): void {
  }

}
