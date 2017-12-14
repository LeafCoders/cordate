import { Component, Input } from '@angular/core';

import { Upload } from '../../server/rest-api.model';

@Component({
  selector: 'lc-upload-box',
  templateUrl: './upload-box.component.html',
  styleUrls: ['./upload-box.component.scss']
})
export class UploadBoxComponent {
  private upload: Upload;
  private fileType: 'UNKNOWN' | 'IMAGE' | 'AUDIO' = 'UNKNOWN';

  @Input('upload')
  set setUpload(upload: Upload) {
    this.upload = upload;
    if (upload.mimeType.startsWith('image')) {
      this.fileType = 'IMAGE';
    } else if (upload.mimeType.startsWith('audio')) {
      this.fileType = 'AUDIO';
    }
  }
}
