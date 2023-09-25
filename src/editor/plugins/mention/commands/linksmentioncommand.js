import AutocompleteCommand from '../../autocomplete/autocompletecommand';

export default class LinksMentionCommand extends AutocompleteCommand {
  constructor(editor, type) {
    super(editor);
    this.type = type;
  }

  execute(options) {
    const { item, marker, range } = this.normalizeOptions(options);
    this.validateMarker(marker, item.id);

    this.editor.model.change((writer) => {
      writer.remove(range);
      writer.insertText(' ', {}, range.start);
      writer.insertText(this.getText(item), { linkHref: this.getHref(item) }, range.start);
    });
  }

  getHref(item) {
    if (this.type === 'task') {
      const onesAppUrl = this.editor.config.get('onesAppLinkUrl');
      return `${onesAppUrl}/tasks/${item.uuid}`;
    }

    return '';
  }

  getText(item) {
    const { t } = this.editor.locale;

    if (this.type === 'task') {
      return `${t('[Task]')} ${item.uniqueSearchId} ${item.title}`;
    }

    if (this.type === 'lark_file') {
      return `${t('[Document]')} ${item.name}`;
    }

    return '';
  }
}
