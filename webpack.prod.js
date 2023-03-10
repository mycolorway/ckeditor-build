const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');


module.exports = merge(common, {
  mode: 'production',

  entry: './src/editor/editor.jsx',

  output: {
    library: 'CKEditor',

    path: path.resolve(__dirname, 'build'),
    filename: 'ckeditor.js',
    libraryTarget: 'umd',
    libraryExport: 'default',

    clean: true,
  },

  externals: {
    react: 'react',
    'react-dom': 'react-dom',
  },

  // By default webpack logs warnings if the bundle is bigger than 200kb.
  performance: { hints: false },
});