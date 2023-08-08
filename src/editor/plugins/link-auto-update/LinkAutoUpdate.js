import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

export default class LinkAutoUpdate extends Plugin {
  init() {
    this.definePostFixer();
  }

  definePostFixer() {
    const { editor } = this;
    const { document } = editor.model;

    document.registerPostFixer((writer) => {
      if (editor.state !== 'ready') return false;

      const changes = document.differ.getChanges();
      return changes.some((change) => {
        if (change.type === 'attribute' && change.attributeKey === 'linkHref') {
          const node = change.range.start.nodeAfter;
          if (node) {
            const text = node._data
            // 如果 href 和 文案是一样的，更新链接时，文案也会被更新
            if (text && text === change.attributeOldValue) {
              const link = writer.createText(change.attributeNewValue);
              writer.setAttributes(
                {
                  linkHref: node.getAttribute('linkHref'),
                  linkConverted: node.getAttribute('linkConverted'),
                },
                link,
              );
              writer.remove(change.range);
              writer.insert(link, change.range.start);
              return true;
            }
          }
          
        }
        
        return false;
      });
    });
  }
}