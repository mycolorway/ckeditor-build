import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

class CustomImagePlugin extends Plugin {

    init() {
      this.resourceKey = 'resourceUuid';
      // 扩展属性
      this.extendSchema();

      // 定义数据转换规则
      this.defineConversion();

      // 监听上传完成事件, 新增属性
      this.initUploadedHandler();
    }

    defineConversion() {
      const { editor } = this;
      
      editor.conversion.for( 'upcast' ).attributeToAttribute( {
        view: 'data-ones-resource-uuid',
        model: 'resourceUuid'
      } );

      editor.conversion.for( 'downcast' ).add( dispatcher => {
        dispatcher.on( 'attribute:resourceUuid:imageBlock', ( evt, data, conversionApi ) => {
          if ( !conversionApi.consumable.consume( data.item, evt.name ) ) {
            return;
          }

          const viewWriter = conversionApi.writer;
          const figure = conversionApi.mapper.toViewElement( data.item );
          const img = figure.getChild( 0 );

          if ( data.attributeNewValue !== null ) {
            viewWriter.setAttribute( 'data-ones-resource-uuid', data.attributeNewValue, img );
          } else {
            viewWriter.removeAttribute( 'data-ones-resource-uuid', img );
          }
        } );
      });
    }

    extendSchema() {
      const { schema } = this.editor.model;
      schema.extend( 'imageBlock', { allowAttributes: this.resourceKey } );
    }

    initUploadedHandler() {
      const { editor } = this;
      const imageUploadEditing = editor.plugins.get( 'ImageUploadEditing' );

      imageUploadEditing.on( 'uploadComplete', ( evt, { data, imageElement } ) => {
        if (data.resourceUuid) {
          editor.model.change( writer => {
            writer.setAttribute( this.resourceKey, data[this.resourceKey], imageElement );
          } );
        }
      } );
    }
}

export default CustomImagePlugin;
