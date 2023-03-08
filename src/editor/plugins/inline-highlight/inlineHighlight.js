import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

export default class InlineHighlight extends Plugin {
  init() {
    const { editor } = this;
    const options = editor.config.get('highlight.options');

    const converterDefinition = {
      model: {
        key: 'highlight',
        values: [],
      },
      view: {},
      converterPriority: 'high',
    };

    options.forEach((option) => {
      converterDefinition.model.values.push(option.model);

      converterDefinition.view[option.model] = {
        name: 'mark',
        styles: {
          background: option.color,
        },
      };
    });

    editor.conversion.attributeToElement(converterDefinition);
  }
}
