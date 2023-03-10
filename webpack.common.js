'use strict';

const path = require('path');
const webpack = require('webpack');

const { styles } = require('@ckeditor/ckeditor5-dev-utils');

const customIcons = [
  'align-center',
  'align-justify',
  'align-left',
  'align-right',
  'bold',
  'bulletedlist',
  'dropdown-arrow',
  'eraser',
  'image',
  'italic',
  'marker',
  'numberedlist',
  'object-center',
  'object-left',
  'object-right',
  'pencil',
  'pilcrow',
  'quote',
  'strikethrough',
  'todolist',
  'underline',
  'unlink',
];


module.exports = {

  resolve: {
    extensions: ['.js', '.jsx'],
  },

  module: {
    rules: [
      {
        // 匹配js/jsx
        test: /\.jsx?$/,
        // 排除node_modules
        exclude: /node_modules/,
        use: {
          // 确定使用的loader
          loader: "babel-loader",
          // 参数配置
          options: {
            presets: [
              [
                // 预设polyfill
                "@babel/preset-env",
                {
                  // polyfill 只加载使用的部分
                  useBuiltIns: "usage",
                  // 使用corejs解析，模块化
                  corejs: "3",
                },
              ],
              // 解析react
              "@babel/preset-react",
            ],
            // 使用transform-runtime，避免全局污染，注入helper
            plugins: ["@babel/plugin-transform-runtime"],
          },
        },
      },

      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader',
        ]
      },

      // ckeditor5
      {
        test: /ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/,

        use: ['raw-loader']
      },
      {
        test: /ckeditor5-[^/\\]+[/\\]theme[/\\].+\.css$/,

        use: [
          {
            loader: 'style-loader',
            options: {
              injectType: 'singletonStyleTag',
              attributes: {
                'data-cke': true
              }
            }
          },
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: styles.getPostCssConfig({
                themeImporter: {
                  themePath: require.resolve('@ckeditor/ckeditor5-theme-lark')
                },
                minify: true
              })
            }
          }
        ]
      }
    ]
  },

  plugins: [
    // 替换 editor svg 图标
    new webpack.NormalModuleReplacementPlugin(
      /ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/,
      function (result) {
        const match = result.request.match(/[^/]+\/theme\/icons\/([^/]+)\.svg$/);
        if (match && customIcons.includes(match[1])) {
          const newSvgPath = path.resolve(__dirname, `src/editor/theme/icons/${match[1]}.svg`);
          result.request = newSvgPath
          result.createData.resource = newSvgPath;
        }
      }
    ),

  ],

  // By default webpack logs warnings if the bundle is bigger than 200kb.
  performance: { hints: false }
};