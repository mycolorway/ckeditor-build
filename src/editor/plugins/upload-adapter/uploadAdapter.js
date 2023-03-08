// eslint-disable-next-line max-classes-per-file
import { gql } from '@apollo/client';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import FileRepository from '@ckeditor/ckeditor5-upload/src/filerepository';

const CREATE_DIRECT_UPLOAD = gql`
  mutation CreateDirectUpload(
    $filename: String!
    $byteSize: Int
    $contentType: String!
  ) {
    createDirectUpload(
      filename: $filename
      byteSize: $byteSize
      contentType: $contentType
    ) {
      directUpload {
        key
        url
        headers
        blobId
        signedBlobId
        service
      }
    }
  }
`;

class Adapter {
  constructor(loader, apolloClient, editor, imageStorageUrl) {
    this.loader = loader;
    this.apolloClient = apolloClient;
    this.editor = editor;
    this.uploadingAction = null;
    this.imageStorageUrl = imageStorageUrl;
  }

  upload() {
    return this.loader.file.then(
      (file) => new Promise((resolve, reject) => {
        this.createAttfile(file).then(({ data }) => {
          const {
            createDirectUpload: { directUpload },
          } = data;
          this.initRequest(
            directUpload.url,
            (directUpload.service === 'qiniu' || directUpload.service === 'ones') ? 'POST' : 'PUT',
          );
          this.initListeners(resolve, reject, { ...file, ...directUpload });
          this.sendRequest(file, directUpload);
        });
      }),
    );
  }

  abort() {
    if (this.xhr) this.xhr.abort();
  }

  async createAttfile(file) {
    return this.apolloClient.mutate({
      mutation: CREATE_DIRECT_UPLOAD,
      variables: {
        filename: file.name,
        byteSize: file.size,
        contentType: file.type,
      },
    });
  }

  initRequest(url, method = 'POST') {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.responseType = 'json';
    this.xhr = xhr;
  }

  initListeners(resolve, reject, file) {
    const { xhr, loader } = this;
    const genericErrorText = `Couldn't upload file: ${file.name}.`;

    xhr.addEventListener('error', () => reject(genericErrorText));
    xhr.addEventListener('abort', () => reject());
    xhr.addEventListener('load', () => {
      const { response } = xhr;

      if (response?.error || (file.service === 'qiniu' && !response)) {
        return reject(
          response && response.error
            ? response.error.message
            : genericErrorText,
        );
      }
      if (this.editor.plugins.has('PendingActions')) {
        const pendingActions = this.editor.plugins.get('PendingActions');
        pendingActions.remove(this.uploadingAction);
      }
      const imageUrl = `${this.imageStorageUrl}/${file.signedBlobId}/file`;
      return resolve({
        default: imageUrl,
      });
    });

    if (xhr.upload) {
      xhr.upload.addEventListener('progress', (evt) => {
        if (evt.lengthComputable) {
          loader.uploadTotal = evt.total;
          loader.uploaded = evt.loaded;
        }
      });
    }
  }

  sendRequest(file, directUpload = {}) {
    if (this.editor.plugins.has('PendingActions')) {
      const pendingActions = this.editor.plugins.get('PendingActions');
      this.uploadingAction = pendingActions.add('upload image');
    }

    const headers = JSON.parse(directUpload.headers);
    delete headers['Content-Type'];

    Object.keys(headers).forEach((headerName) => {
      this.xhr.setRequestHeader(headerName, headers[headerName]);
    });

    const formData = new FormData();

    if (directUpload.service === 'qiniu') {
      formData.append('key', directUpload.key);
      formData.append('token', headers['x-token']);
    } else if (directUpload.service === 'ones') {
      if (headers.token) formData.append('token', headers.token);
      const postFormData = headers?.post_form_data;
      Object.keys(postFormData || {}).forEach((headerName) => {
        formData.append(headerName, postFormData[headerName]);
      });
    }
    formData.append('file', file);
    this.xhr.send(formData);
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
    const apolloClient = this.editor.config.get('apolloClient');
    const plugin = this.editor.plugins.get('FileRepository');
    const imageStorageUrl = this.editor.config.get('imageStorageUrl');
    plugin.createUploadAdapter = (loader) => new Adapter(loader, apolloClient, this.editor, imageStorageUrl);
  }
}
