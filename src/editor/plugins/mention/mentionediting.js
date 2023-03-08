import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import {
  toWidget,
  viewToModelPositionOutsideModelElement,
} from '@ckeditor/ckeditor5-widget/src/utils';
import Widget from '@ckeditor/ckeditor5-widget/src/widget';

import MembersMentionCommand from './commands/membersmentioncommand';
import LinksMentionCommand from './commands/linksmentioncommand';

function createModelElement(viewElement, { writer: modelWriter }) {
  return modelWriter.createElement('mention', {
    id: viewElement.getAttribute('data-uuid') || '',
    openId: viewElement.getAttribute('data-open-id') || '',
    text: viewElement.childCount > 0 ? viewElement.getChild(0).data : '',
  });
}

export default class MentionEditing extends Plugin {
  static get pluginName() {
    return 'MentionEditing';
  }

  static get requires() {
    return [Widget];
  }

  init() {
    this.defineSchema();
    this.defineConverters();

    this.editor.editing.mapper.on(
      'viewToModelPosition',
      viewToModelPositionOutsideModelElement(this.editor.model, (viewElement) => viewElement.hasClass('mention')),
    );

    this.editor.commands.add('membersMention', new MembersMentionCommand(this.editor));
    this.editor.commands.add('tasksMention', new LinksMentionCommand(this.editor, 'task'));
    this.editor.commands.add('docsMention', new LinksMentionCommand(this.editor, 'lark_file'));
  }

  defineSchema() {
    const { schema } = this.editor.model;
    schema.register('mention', {
      allowWhere: '$text',
      isInline: true,
      isObject: true,
      allowAttributes: ['id', 'openId', 'text'],
    });
  }

  defineConverters() {
    const { editor } = this;

    editor.conversion
      .for('upcast')
      .elementToElement({
        view: {
          name: 'span',
          classes: ['mention'],
        },
        model: createModelElement,
        converterPriority: 'highest',
      })
      .elementToElement({
        view: {
          name: 'span',
          classes: ['mention'],
        },
        model: createModelElement,
        converterPriority: 'highest',
      })
      .elementToElement({
        view: {
          name: 'span',
          attributes: {
            'data-uuid': true,
          },
        },
        model: createModelElement,
        converterPriority: 'highest',
      });

    editor.conversion.for('dataDowncast').elementToElement({
      model: 'mention',
      view(modelElement, { writer: viewWriter }) {
        const mentionElement = viewWriter.createContainerElement('span', {
          class: 'mention',
          'data-uuid': modelElement.getAttribute('id'),
          'data-open-id': modelElement.getAttribute('openId') || '',
        });

        const textNode = viewWriter.createText(
          modelElement.getAttribute('text'),
        );
        viewWriter.insert(
          viewWriter.createPositionAt(mentionElement, 0),
          textNode,
        );

        return mentionElement;
      },
    });

    editor.conversion.for('editingDowncast').elementToElement({
      model: 'mention',
      view(modelElement, { writer: viewWriter }) {
        const mentionElement = viewWriter.createContainerElement('span', {
          class: 'mention',
          'data-uuid': modelElement.getAttribute('id'),
          'data-open-id': modelElement.getAttribute('openId') || '',
        });

        const textNode = viewWriter.createText(
          modelElement.getAttribute('text'),
        );
        viewWriter.insert(
          viewWriter.createPositionAt(mentionElement, 0),
          textNode,
        );

        return toWidget(mentionElement, viewWriter);
      },
    });
  }
}
