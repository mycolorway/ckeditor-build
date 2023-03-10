/* eslint-disable no-underscore-dangle */
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import LinkUI from '@ckeditor/ckeditor5-link/src/linkui';
import { isLinkElement } from '@ckeditor/ckeditor5-link/src/utils';
import MouseEventsObserver from './mouseEventObserver';
import OPEN_LINK_RULES from './rules';
import { debounce } from '../../utils';


function findLinkElementAncestor(item) {
  if (!item) return null;
  if (isLinkElement(item)) return item;
  return item.getAncestors().find((ancestor) => isLinkElement(ancestor));
}

export default class LinkOpener extends Plugin {
  static get pluginName() {
    return 'LinkOpener';
  }

  static get requires() {
    return [LinkUI];
  }

  init() {
    this.linkUI = this.editor.plugins.get(LinkUI);
    this.openTask = this.editor.config.get('customFunctions').openTask;
    this.editor.editing.view.addObserver(MouseEventsObserver);
    this.defineListener();
  }

  defineListener() {
    const { editor, linkUI } = this;
    const viewDocument = editor.editing.view.document;

    linkUI.listenTo(
      viewDocument,
      'click',
      (event, domEventData) => {
        const parentLink = findLinkElementAncestor(domEventData.target);
        if (parentLink) {
          event.stop();
          const href = parentLink.getAttribute('href');
          if (href) {
            domEventData.preventDefault();
            const opened = this.openLink(href);
            if (!opened) window.open(href);
          }
        }
      },
      { priority: 'high' },
    );

    if (linkUI?.actionsView?.previewButtonView) {
      linkUI.actionsView.previewButtonView.on(
        'render',
        ({ source: { element } }) => {
          element.addEventListener('click', (event) => {
            const { href } = event.currentTarget;
            const opened = this.openLink(href);
            if (opened) event.preventDefault();
          });
        },
      );
    }


    const handleMousemove = debounce((_, { target }) => {
      if (!linkUI.isEnabled || !editor.ui.view.editable.isFocused) return;

      const parentLink = findLinkElementAncestor(target);
      if (parentLink) {
        const href = parentLink.getAttribute('href');
        if (
          linkUI._isUIVisible
          && linkUI?.formView?.urlInputView?.fieldView?.value === href
        ) {
          return;
        }
        if (linkUI._isUIVisible) linkUI._hideUI();

        const position = editor.editing.view.createPositionBefore(target);
        const modelPosition = editor.editing.mapper.toModelPosition(position);
        const offset = parseInt(modelPosition.nodeAfter.data.length / 2, 10);
        editor.model.change((writer) => {
          if (offset) {
            writer.setSelection(modelPosition.getShiftedBy(offset));
          } else {
            writer.setSelection(modelPosition.nodeAfter, 'on');
          }
        });

        linkUI._showUI();
      }
    }, 500);

    linkUI.listenTo(viewDocument, 'mousemove', debounce(handleMousemove, 500));
  }

  openLink(link) {
    const { editor, linkUI } = this;
    const opened = OPEN_LINK_RULES.some((rule) => {
      const matches = link.match(rule.regex);
      if (!matches) return false;
      linkUI._hideUI();
      editor.ui.view.editable._editableElement.blur();
      rule.openLink({ matches }, this.openTask);
      return true;
    });
    return opened;
  }
}
