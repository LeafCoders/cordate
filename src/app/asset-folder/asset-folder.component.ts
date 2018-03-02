import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BaseContainer } from '../shared/base/base-container';
import { AuthPermissionService } from '../auth/auth-permission.service';
import { AssetFoldersResource } from '../shared/server/asset-folders.resource';
import { AssetFolder } from '../shared/server/rest-api.model';

@Component({
  selector: 'lc-asset-folder',
  templateUrl: './asset-folder.component.html'
})
export class AssetFolderComponent extends BaseContainer<AssetFolder> {

  constructor(
    private assetFoldersResource: AssetFoldersResource,
    private authPermission: AuthPermissionService,
    router: Router,
    route: ActivatedRoute,
  ) {
    super(assetFoldersResource, router, route);
  }

  protected init(): void {
    this.allowAddNew = this.authPermission.isPermitted(this.assetFoldersResource.createPermission());
  }
}
