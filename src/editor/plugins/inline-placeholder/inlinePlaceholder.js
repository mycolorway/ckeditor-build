/* eslint-disable no-restricted-syntax */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

const PARA_PLACEHOLDER_CLASS = 'ck-inline-placeholder';
const PARA_PLACEHOLDER_DATA_NAME = 'data-inline-placeholder';

function needsPlaceholder(document, selection) {
  const selectionAnchor = selection.anchor;
  if (selection.rangeCount !== 1
    || !selection.isCollapsed
    || !selectionAnchor
    || !document.isFocused) {
    return false;
  }

  const element = selectionAnchor.parent;
  const isRootChild = element.parent && element.parent.is('rootElement');

  // 当段落向右对齐时，placeholder 会很奇怪
  if (!isRootChild || !element.isEmpty || element.hasStyle('text-align')) {
    return false;
  }

  return true;
}

function showPlaceholder(writer, element, text) {
  if (element && !element.hasClass(PARA_PLACEHOLDER_CLASS)) {
    writer.addClass(PARA_PLACEHOLDER_CLASS, element);
    writer.setAttribute(PARA_PLACEHOLDER_DATA_NAME, text, element);
    return true;
  }

  return false;
}

function hidePlaceholder(writer, element) {
  if (element && element.hasClass(PARA_PLACEHOLDER_CLASS)) {
    writer.removeClass(PARA_PLACEHOLDER_CLASS, element);
    writer.removeAttribute(PARA_PLACEHOLDER_DATA_NAME, element);

    return true;
  }

  return false;
}

/**
 *
 *
 * @export
 * @class InlinePlaceholder
 * @extends {Plugin}
 *
 * 支持参数：
 * placeholder: 编辑器默认的 placeholder 文案
 * inlinePlaceholder：
 *   focus: 聚焦到空编辑器时的 placeholder 文案
 *   paragraph: 聚焦到空段落时，paragraph 内的 placeholder 文案
 */
export default class InlinePlaceholder extends Plugin {
  init() {
    this.placeholder = this.editor.config.get('placeholder') || '';
    this.inlinePlaceholder = this.editor.config.get('inlinePlaceholder') || {};
    this.definePostFixer();
  }

  definePostFixer() {
    const { view } = this.editor.editing;
    const viewDocument = view.document;

    viewDocument.registerPostFixer((writer) => {
      const { selection } = viewDocument;
      let wasViewModified = false;
      let paraWithPlaceholder;

      const viewRoot = viewDocument.getRoot();
      const rootChildren = viewRoot.getChildren();

      for (const child of rootChildren) {
        if (child.hasClass(PARA_PLACEHOLDER_CLASS)) {
          paraWithPlaceholder = child;
          break;
        }
      }

      if (needsPlaceholder(viewDocument, selection)) {
        const element = selection.anchor.parent;

        if (element !== paraWithPlaceholder) {
          if (hidePlaceholder(writer, paraWithPlaceholder)) {
            wasViewModified = true;
          }

          if (showPlaceholder(writer, element, this.getPlaceholderText(element))) {
            wasViewModified = true;
          }
        }
      } else if (hidePlaceholder(writer, paraWithPlaceholder)) {
        wasViewModified = true;
      }

      return wasViewModified;
    });
  }

  getPlaceholderText(element) {
    let text;
    /**
     * 按照 Notion 的设计，未来对 List、Heading 等容器都会有不同的 Placeholder 文案
     * 这里先将扩展空间留出。
     * if element.is('containerElement', 'li')
     * text = '有序列表'
     * .etc
     */
    if (element.is('containerElement', 'p')) {
      if (element.parent.childCount === 1) {
        text = this.inlinePlaceholder.focus || this.placeholder;
      } else if (this.inlinePlaceholder.paragraph) {
        text = this.inlinePlaceholder.paragraph;
      }
    }
    return text || '';
  }
}
