import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import MentionUI from './mentionui';
import MentionEditing from './mentionediting';

export default class Mention extends Plugin {
  static get pluginName() {
    return 'Mention';
  }

  static get requires() {
    return [MentionUI, MentionEditing];
  }
}
