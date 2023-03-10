import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import normalizeClipboardHtml from '@ckeditor/ckeditor5-clipboard/src/utils/normalizeclipboarddata';
import HtmlDataProcessor from '@ckeditor/ckeditor5-engine/src/dataprocessor/htmldataprocessor';

function plainTextToHtml(text) {
  let result = text
    // Encode <>.
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Creates paragraphs for every line breaks.
    .replace(/\r\n/g, '</p><p>')
    .replace(/\r/g, '</p><p>')
    .replace(/\n/g, '</p><p>')
    // Preserve trailing spaces (only the first and last one – the rest is handled below).
    .replace(/^\s/, '&nbsp;')
    .replace(/\s$/, '&nbsp;')
    // Preserve other subsequent spaces now.
    .replace(/\s\s/g, ' &nbsp;');

  if (result.indexOf('</p><p>') > -1) {
    // If we created paragraphs above, add the trailing ones.
    result = `<p>${result}</p>`;
  }

  return result;
}

function isMentionWithoutSpace(text) {
  const regExp = /^@\S*$/;
  return regExp.test(text);
}

export default class ClipboardFixer extends Plugin {
  init() {
    this.ClipboardPipeline = this.editor.plugins.get('ClipboardPipeline');
    this.fixPlainTextLineBreak();
  }

  fixPlainTextLineBreak() {
    const { view } = this.editor.editing;
    const viewDocument = view.document;

    this.listenTo(viewDocument, 'clipboardInput', (e, { dataTransfer }) => {
      let content = '';

      if (dataTransfer.getData('text/html')) {
        content = normalizeClipboardHtml(dataTransfer.getData('text/html'));
      } else if (dataTransfer.getData('text/plain')) {
        content = plainTextToHtml(dataTransfer.getData('text/plain'));
      } else {
        return;
      }
      const dataProcessor = new HtmlDataProcessor(viewDocument);
      content = dataProcessor.toView(content);
      if (isMentionWithoutSpace(content._children[0]._textData)) {
        content._children[0]._textData += ' ';
      } else if (content._children[0]._children !== undefined
        && isMentionWithoutSpace(content._children[0]._children[0]?._textData)) {
        content._children[0]._children[0]._textData += ' ';
      }
      this.ClipboardPipeline.fire('inputTransformation', { content, dataTransfer });
      view.scrollToTheSelection();
      e.stop();
    }, { priority: -999 }); // priority should between normal and low
  }
}