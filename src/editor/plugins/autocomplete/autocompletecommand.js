import Command from '@ckeditor/ckeditor5-core/src/command';
import CKEditorError from '@ckeditor/ckeditor5-utils/src/ckeditorerror';

export default class AutocompleteCommand extends Command {
  normalizeOptions({ item, range, marker }) {
    const { selection } = this.editor.model.document;
    const normalizedItem = typeof item === 'string' ? { id: item, text: item } : item;
    const text = normalizedItem.text || normalizedItem.name;

    return {
      item: {
        ...normalizedItem,
        id: `${marker}${text}`,
        text,
      },
      range: range || selection.getFirstRange(),
      marker,
    };
  }

  validateMarker(marker, id) {
    if (marker.length !== 1) {
      throw new CKEditorError(
        'mentioncommand-incorrect-marker: The marker must be a single character.',
        this,
      );
    }

    if (id?.charAt(0) !== marker) {
      throw new CKEditorError(
        'mentioncommand-incorrect-id: The item id must start with the marker character.',
        this,
      );
    }
  }
}
