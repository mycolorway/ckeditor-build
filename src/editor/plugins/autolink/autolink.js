import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import UpcastWriter from '@ckeditor/ckeditor5-engine/src/view/upcastwriter';

const getPlainText = (node) => {
  if (node.is('text')) return node.data;
  if (node.is('span') && node.getChild(0)) {
    const inner = node.getChild(0);
    if (inner.is('text')) return inner.data;
  }
  return '';
};

const URL_REGEX = /(?:ftp|http|https):\/\/[^ "]+/;
const URL_GLOBAL_REGEX = /(?:ftp|http|https):\/\/[^ "]+/g;

export default class AutoLink extends Plugin {
  static get pluginName() {
    return 'Autolink';
  }

  init() {
    const editor = this.editor;
    const writer = new UpcastWriter(editor.editing.view.document);

    editor.plugins.get('ClipboardPipeline').on('inputTransformation', (evt, data) => {
      if (data.content.childCount !== 1) {
        return;
      }

      const node = data.content.getChild(0);
      const plainText = getPlainText(node);
      if (!plainText || !URL_REGEX.test(plainText)) {
        return;
      }

      const elements = [];
      const texts = plainText.split(URL_REGEX);
      const urls = plainText.match(URL_GLOBAL_REGEX);

      texts.forEach((text, index) => {
        elements.push(writer.createText(text));
        const url = urls[index];
        if (url) {
          elements.push(
            writer.createElement('a', { href: url, class: 'ck-link_selected' }, [writer.createText(url)]),
          );
        }
      });

      data.content = writer.createDocumentFragment(elements);
    });
  }
}