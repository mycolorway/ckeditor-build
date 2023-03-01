import React from 'react';
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import { CKEditor } from '@ckeditor/ckeditor5-react';

import './theme/editor.scss';
import './translations/zh-CN'

import config from './config';


function Editor() {
  return (
    <CKEditor
      editor={ClassicEditor}
      data="<p>Hello from CKEditor 5!</p>"
      config={config}
    />
  )
}

export default Editor;