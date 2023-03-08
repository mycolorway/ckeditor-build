import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import { isImageViewerWidget, injectUIIntoWidget } from './utils';

export default class ImageViewer extends Plugin {
  static get pluginName() {
    return 'ImageViewer';
  }

  init() {
    const disableImageView = this.editor.config.get('disableImageView');
    if (disableImageView) return;
    this.defineListener();
    this.enableUIInjection();
  }

  defineListener() {
    const { editor } = this;
    const editingView = editor.editing.view;

    this.listenTo(editingView.document, 'mousedown', (event, domEvent) => {
      const { domTarget } = domEvent;
      if (!domTarget.closest('.ck-image-viewer__button, .image.ck-widget_selected')) return;
      if (domTarget.closest('.ck-widget__type-around, .ck-widget__resizer')) return;

      const current = this.getImageUrl(domTarget);
      const nodeList = [
        ...editingView.getDomRoot().querySelectorAll('.image.ck-widget'),
      ];
      const images = nodeList.map((node) => this.getImageUrl(node));
      this.fire('imageView', {
        images,
        currentIndex: images.findIndex((url) => url === current),
      });

      domEvent.preventDefault();
      event.stop();
    }, { priority: 'high' });
  }

  getImageUrl(node) {
    const { editor } = this;
    const { domConverter } = editor.editing.view;
    const viewElement = domConverter.mapDomToView(
      node.closest('.image.ck-widget'),
    );
    const modelElement = editor.editing.mapper.toModelElement(viewElement);
    return modelElement.getAttribute('src');
  }

  enableUIInjection() {
    const { editor } = this;
    const { schema } = editor.model;
    const { t } = editor.locale;

    editor.editing.downcastDispatcher.on(
      'insert',
      (_, data, conversionApi) => {
        const viewElement = conversionApi.mapper.toViewElement(data.item);
        if (!isImageViewerWidget(viewElement, data.item, schema)) return;

        injectUIIntoWidget(
          conversionApi.writer,
          t('Preview image'),
          viewElement,
        );
      },
      { priority: 'low' },
    );
  }
}
