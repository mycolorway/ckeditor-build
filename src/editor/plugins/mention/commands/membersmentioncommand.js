import AutocompleteCommand from '../../autocomplete/autocompletecommand';

export default class MentionCommand extends AutocompleteCommand {
  refresh() {
    const { model } = this.editor;
    const { selection } = model.document;
    this.isEnabled = model.schema.checkChild(selection.focus.parent, 'mention');
  }

  execute(options) {
    const { item, marker, range } = this.normalizeOptions(options);
    this.validateMarker(marker, item.id);

    this.editor.model.change((writer) => {
      const mentionElement = writer.createElement('mention', {
        id: item.uuid,
        text: `${marker}${item.name}`,
      });

      writer.remove(range);
      writer.insert(mentionElement, range.start);
      writer.insertText(' ', mentionElement, 'after');
      writer.setSelection(range.start.getShiftedBy(2));
    });
  }
}
