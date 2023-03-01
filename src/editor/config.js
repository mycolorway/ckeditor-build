import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment';
import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat';
import Blockquote from '@ckeditor/ckeditor5-block-quote/src/blockquote';


import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';

const commonPlugins = [
  Autoformat,
  Blockquote,
  Bold,
  Italic,
  Paragraph,
]

const config = {
  plugins: commonPlugins,
  toolbar: {
    shouldNotGroupWhenFull: true,
    items: [
      'bold',
      'italic',
      '|',
      'blockquote'
    ]
  },
  language: 'zh-CN',
}

export default config;