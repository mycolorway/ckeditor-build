import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import FileRepository from '@ckeditor/ckeditor5-upload/src/filerepository';

class Adapter {
  constructor(loader, editor, imageStorageUrl) {
    this.loader = loader;
    this.editor = editor;
    this.uploadingAction = null;
    this.imageStorageUrl = imageStorageUrl;
    this.uploadFile = this.editor.config.get('customFunctions').uploadFile;
  }

  upload() {
    return this.loader.file.then(
      (file) => new Promise((resolve, reject) => {
        if (this.editor.plugins.has('PendingActions')) {
          const pendingActions = this.editor.plugins.get('PendingActions');
          this.uploadingAction = pendingActions.add('upload image');
        }

        this.uploadFile({
          file,
          resolve: (res) => {
            if (this.editor.plugins.has('PendingActions')) {
              const pendingActions = this.editor.plugins.get('PendingActions');
              pendingActions.remove(this.uploadingAction);
            }
            const imageUrl = `${this.imageStorageUrl}/${res.signedBlobId}/file`;
            resolve({
              urls: {
                default: imageUrl
              },
              resourceUuid: res.resourceUuid,
            })
          },
          reject: (err) => {
            reject(err.message);
          },
          onProgress: (percent) => {
            this.loader.uploadedPercent = percent;
          }
        })
      }),
    );
  }
}

export default class UploadAdapter extends Plugin {
  static get requires() {
    return [FileRepository];
  }

  static get pluginName() {
    return 'DumboUploadAdapter';
  }

  init() {
    const plugin = this.editor.plugins.get('FileRepository');
    const imageStorageUrl = this.editor.config.get('imageStorageUrl');
    plugin.createUploadAdapter = (loader) => new Adapter(loader, this.editor, imageStorageUrl);
  }
}
