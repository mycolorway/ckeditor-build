import React, { useRef, useMemo } from 'react';
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import InlineEditor from '@ckeditor/ckeditor5-editor-inline/src/inlineeditor';
import BalloonEditor from '@ckeditor/ckeditor5-editor-balloon/src/ballooneditor';
import { CKEditor } from '@ckeditor/ckeditor5-react';

//dev
import CKEditorInspector from '@ckeditor/ckeditor5-inspector';

import './theme/editor.scss';
import './translations/zh-CN'

import configs from './config';
import { noop } from './utils';


function Editor(props) {

  const {
    openImageViewer = noop,
    baseConfig = 'defaultConfig',
    data,
    type = 'classic',
    disabled = false,
    onInit = noop,
    onChange = noop,
    onBlur = noop,
    onFocus = noop,
    onSave = noop,
    onMentioned = noop,
    onSyncTaskChange = noop,
    viewportTopOffset,
    handleAfterCommandExec = noop,
    ...otherProps
  } = props

  const editorBase = useMemo(() => {
    switch (type) {
      case 'inline':
        return InlineEditor;
      case 'balloon':
        return BalloonEditor;
      case 'classic':
      default:
        return ClassicEditor;
    }
  }, [])

  const mergedConfig = useMemo(() => {
    const result = {
      ...(configs[baseConfig] || {}),
      ...otherProps,
    }
    if (viewportTopOffset) {
      Object.assign(result.toolbar, {
        viewportTopOffset
      })
    }
    return result
  })

  // 延迟操作状态变更
  const needPending = useRef(false);
  const editorPendingChange = (editor) => {
    const pendingActions = editor.plugins.get('PendingActions');

    if (pendingActions.hasAny) {
      needPending.current = true;
      onSyncTaskChange(true);
    } else {
      // 延时操作完成
      if (needPending.current) {
        const isFocus = editor.editing.view.document.isFocused;
        // 是否是失焦状态，触发保存操作
        if (!isFocus && onSave) {
          onSave(editor);
        }
      }
      needPending.current = false;
      onSyncTaskChange(false);
    }
  };

  const handleReady = (editor) => {
    if (!editor) return;

    if (process.env.NODE_ENV === 'development') {
      CKEditorInspector.attach(editor);
      window.editor = editor;
    }

    editor.sourceElement.addEventListener('mousedown', (event) => {
      if (event.target.matches('input[type="checkbox"]')) {
        event.preventDefault();
        setTimeout(() => {
          if (onSave) {
            onSave(editor);
          }
        }, 200);
      }
    });

    const mentionCommand = editor.commands.get('mention');
    if (mentionCommand && onMentioned) {
      mentionCommand.on('execute', (event, args) => {
        onMentioned(event, args, editor);
      });
    }

    if (editor.plugins.has('ImageViewer')) {
      editor.plugins.get('ImageViewer').on('imageView', (_, args) => {
        openImageViewer(args);
      });
    }

    if (type === 'balloon') {
      // https://github.com/ckeditor/ckeditor5/issues/2343#issuecomment-382711345
      // 气泡工具栏的箭头是硬编码，去掉箭头及预留空间需要按照上述官方推荐的做法

      const balloonPanelViewConstructor = editor.plugins.get('ContextualBalloon').view.constructor;

      balloonPanelViewConstructor.arrowHorizontalOffset = 25;
      balloonPanelViewConstructor.arrowVerticalOffset = 3;
    }

    if (onInit) onInit(editor);

    // 监听延迟操作，用于处理图片上传等事件
    if (editor.plugins.has('PendingActions')) {
      const pendingActions = editor.plugins.get('PendingActions');
      pendingActions.on('change:hasAny', () => editorPendingChange(editor));
    }

    // editor 所有功能增加埋点
    const allButtons = Array.from(editor.ui.componentFactory.names());
    allButtons.forEach((item) => {
      const btn = editor.commands.get(item);
      if (btn) {
        btn.on('execute', () => handleAfterCommandExec(item));
      }
    });
  };

  const ignoreBlurRef = useRef(false);
  const handleBlur = (event, editor) => {
    // 有正在进行的异步任务，例如上传图片
    if (ignoreBlurRef.current
      || needPending.current) {
      return;
    }

    // 解决mention插件，此时如果内容为空，编辑器会自动关闭
    // eslint-disable-next-line no-underscore-dangle
    const [lastFocus] = editor.ui.focusTracker._elements;
    if (lastFocus) {
      const lastFocusClasslist = lastFocus.classList;
      const lastClass = lastFocusClasslist[lastFocusClasslist.length - 1];
      const ignoreBlurClass = [
        'ck-balloon-panel_visible', // mention 组件
      ];
      if (ignoreBlurClass.includes(lastClass)) {
        return;
      }
    }
    editor.ui.element.classList.remove('ck-focused');
    if (onBlur) onBlur(event, editor);
  }

  const handleFocus = (event, editor) => {
    ignoreBlurRef.current = true;
    setTimeout(() => {
      ignoreBlurRef.current = false;
    }, 100);
    editor.ui.element.classList.add('ck-focused');
    if (onFocus) onFocus(event, editor);
  }

  return (
    <CKEditor
      editor={editorBase}
      config={mergedConfig}
      data={data}
      disabled={disabled}
      onReady={handleReady}
      onChange={onChange}
      onBlur={handleBlur}
      onFocus={handleFocus}
    />
  )
}

export default Editor;