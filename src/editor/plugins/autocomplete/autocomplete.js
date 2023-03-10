import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import AutocompleteUI from './autocompleteui';

export default class Autocomplete extends Plugin {
  static get pluginName() {
    return 'Autocomplete';
  }

  static get requires() {
    return [AutocompleteUI];
  }
}
