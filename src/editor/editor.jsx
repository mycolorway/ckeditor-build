import React, { useCallback, useState, useRef } from 'react';
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import { CKEditor } from '@ckeditor/ckeditor5-react';

//dev
import CKEditorInspector from '@ckeditor/ckeditor5-inspector';

import './theme/editor.scss';
import './translations/zh-CN'

import config from './config';


function Editor() {

  const editorRef = useRef();

  const [data, setData] = useState('this is editor content');

  const handleChange = useCallback((event, editor) => {
    const data = editor.getData();
    setData(data);
  }, [])

  const handleInit = useCallback((editor) => {
    editorRef.current = editor;
    if (process.env.NODE_ENV === 'development') {
      CKEditorInspector.attach(editor);
    }
  }, [])

  return (
    <CKEditor
      editor={ClassicEditor}
      config={config}
      data={data}
      onReady={handleInit}
      onChange={handleChange}
    />
  )
}

export default Editor;