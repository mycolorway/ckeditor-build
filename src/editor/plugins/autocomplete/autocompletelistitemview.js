import LabelView from '@ckeditor/ckeditor5-ui/src/label/labelview';
/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module mention/ui/mentionlistitemview
 */

import ListItemView from '@ckeditor/ckeditor5-ui/src/list/listitemview';
import ListSeparatorView from '@ckeditor/ckeditor5-ui/src/list/listseparatorview';

export default class AutoCompleteListItemView extends ListItemView {
  highlight() {
    const child = this.getTargetChild();
    if (child) {
      child.isOn = true;
    }
  }

  removeHighlight() {
    const child = this.getTargetChild();
    if (child) {
      child.isOn = false;
    }
  }

  getTargetChild() {
    const validChildren = this.children.filter(
      (child) => [LabelView, ListSeparatorView].indexOf(child.constructor) === -1,
    );
    return validChildren[0];
  }
}
