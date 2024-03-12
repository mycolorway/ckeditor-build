import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

class CustomImagePlugin extends Plugin {
  init() {
    this.resourceKey = 'signedBlobId';
    this.domDataKey = 'data-task-signed-blob-id';
    // 扩展属性
    this.extendSchema();

    // 定义数据转换规则
    this.defineConversion();

    // 监听上传完成事件, 新增属性
    this.initUploadedHandler();
  }

  defineConversion() {
    const { editor } = this;

    editor.conversion.for('upcast').attributeToAttribute({
      view: this.domDataKey,
      model: this.resourceKey,
    });

    editor.conversion.for('downcast').add((dispatcher) => {
      dispatcher.on(
        `attribute:${this.resourceKey}:imageBlock`,
        (evt, data, conversionApi) => {
          if (!conversionApi.consumable.consume(data.item, evt.name)) {
            return;
          }

          const viewWriter = conversionApi.writer;
          const figure = conversionApi.mapper.toViewElement(data.item);
          const img = figure.getChild(0);

          if (data.attributeNewValue !== null) {
            viewWriter.setAttribute(
              this.domDataKey,
              data.attributeNewValue,
              img
            );
          } else {
            viewWriter.removeAttribute(this.domDataKey, img);
          }
        }
      );
    });
  }

  extendSchema() {
    const { schema } = this.editor.model;
    schema.extend('imageBlock', { allowAttributes: this.resourceKey });
  }

  initUploadedHandler() {
    const { editor } = this;
    try {
      const imageUploadEditing = editor.plugins.get('ImageUploadEditing');
      imageUploadEditing.on('uploadComplete', (evt, { data, imageElement }) => {
        if (data[this.resourceKey]) {
          editor.model.change((writer) => {
            writer.setAttribute(
              this.resourceKey,
              data[this.resourceKey],
              imageElement
            );
          });
        }
      });
    } catch (e) {}
  }
}

export default CustomImagePlugin;
