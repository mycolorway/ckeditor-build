import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment';
import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat';
import Blockquote from '@ckeditor/ckeditor5-block-quote/src/blockquote';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Code from '@ckeditor/ckeditor5-basic-styles/src/code';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import Highlight from '@ckeditor/ckeditor5-highlight/src/highlight';
import Image from '@ckeditor/ckeditor5-image/src/image';
import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload';
import ImageResize from '@ckeditor/ckeditor5-image/src/imageresize';
import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle';
import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar';
import Link from '@ckeditor/ckeditor5-link/src/link';
import List from '@ckeditor/ckeditor5-list/src/list';
import PasteFromOffice from '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice';
import Strikethrough from '@ckeditor/ckeditor5-basic-styles/src/strikethrough';
import TodoList from '@ckeditor/ckeditor5-list/src/todolist';
import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline';
import PendingActions from '@ckeditor/ckeditor5-core/src/pendingactions';

import Autolink from './plugins/autolink/autolink';
import ClipboardFixer from './plugins/clipboard-fixer/clipboardFixer';
import ImageViewer from './plugins/image-viewer/imageViewer';
import InlineHighlight from './plugins/inline-highlight/inlineHighlight';
import InlinePlaceholder from './plugins/inline-placeholder/inlinePlaceholder';
import LinkConverter from './plugins/link-converter/linkConverter';
import LinkOpener from './plugins/link-opener/linkOpener';
import UploadAdapter from './plugins/upload-adapter/uploadAdapter';
import WidgetFixer from './plugins/widget-fixer/widgetFixer';

// TODO: 剪贴板 api 有更改
// 详见：https://ckeditor.com/docs/ckeditor5/latest/updating/guides/update-to-27.html#clipboard-input-pipeline-integration

const commonPlugins = [
  Autoformat,
  Autolink,
  Blockquote,
  Bold,
  Code,
  ClipboardFixer,
  Essentials,
  Highlight,
  Image,
  ImageResize,
  ImageStyle,
  ImageToolbar,
  ImageUpload,
  ImageViewer,
  InlineHighlight,
  InlinePlaceholder,
  Italic,
  Link,
  LinkConverter,
  LinkOpener,
  List,
  // Mention,
  Paragraph,
  PasteFromOffice,
  UploadAdapter,
  Strikethrough,
  TodoList,
  Underline,
  WidgetFixer,
  PendingActions,
]

// 高亮配置
const highlight = {
  options: [
    {
      model: 'pinkMarker',
      class: 'marker-pink',
      title: '',
      color: '#ffbdb3',
      type: 'marker',
    },
    {
      model: 'orangeMarker',
      class: 'marker-orange',
      title: '',
      color: '#ffd47f',
      type: 'marker',
    },
    {
      model: 'yellowMarker',
      class: 'marker-yellow',
      title: '',
      color: '#fff362',
      type: 'marker',
    },
    {
      model: 'greenMarker',
      class: 'marker-green',
      title: '',
      color: '#b2fda9',
      type: 'marker',
    },
    {
      model: 'blueMarker',
      class: 'marker-blue',
      title: '',
      color: '#a8ceff',
      type: 'marker',
    },
    {
      model: 'purpleMarker',
      class: 'marker-purple',
      title: '',
      color: '#dfb1ff',
      type: 'marker',
    },
  ],
};

//图片配置
const image = {
  resizeUnit: 'px',
  toolbar: [
    'imageStyle:alignLeft',
    'imageStyle:alignCenter',
    'imageStyle:alignRight',
  ],
  styles: ['alignLeft', 'alignCenter', 'alignRight'],
};

const config = {
  plugins: commonPlugins,
  toolbar: {
    shouldNotGroupWhenFull: true,
    items: [
      'highlight',
      '|',
      'bold',
      'italic',
      'strikethrough',
      'underline',
      '|',
      'bulletedList',
      'numberedList',
      '|',
      'todolist',
      'blockquote',
      'code',
      'link',
    ]
  },
  highlight,
  image,
  link: {
    addTargetToExternalLinks: true,
  },
  disableImageView: false,
  language: 'zh-CN',
}

export default config;