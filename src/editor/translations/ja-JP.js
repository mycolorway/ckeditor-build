const translations = window.CKEDITOR_TRANSLATIONS || (window.CKEDITOR_TRANSLATIONS = {});
translations['ja-JP'] = translations['ja-JP'] || {};
const locale = translations['ja-JP'];
locale.dictionary = Object.assign(locale.dictionary || {}, {
  '%0 of %1': '第 %0 歩、合計 %1 歩',
  'Block quote': '引用',
  Bold: '太字',
  'Bulleted List': '箇条書きリスト',
  Cancel: 'キャンセル',
  'Cannot upload file:': 'アップロードできません。ファイル名：',
  'Centered image': '画像中央揃え',
  'Change image text alternative': '画像の代替テキストを変更',
  'Choose heading': 'Aa',
  Column: '列',
  'Could not insert image at the current position.': '現在の位置に画像を挿入できません',
  'Could not obtain resized image URL.': 'サイズ変更の画像URLの取得に失敗しました',
  'Decrease indent': 'インデント解除',
  'Delete column': 'この列を削除',
  'Delete row': 'この行を削除',
  Downloadable: 'ダウンロード可',
  'Dropdown toolbar': 'ドロップダウンツールバー',
  'Edit link': 'URLを編集',
  'Editor toolbar': 'エディタツールバー',
  'Enter image caption': '画像タイトルを入力',
  'Full size image': '全画面表示',
  'Header column': '見出し列',
  'Header row': '見出し行',
  Heading: '見出し',
  'Heading 1': '見出し1',
  'Heading 2': '見出し2',
  'Heading 3': '見出し3',
  'Heading 4': '見出し4',
  'Heading 5': '見出し5',
  'Heading 6': '見出し6',
  'Image toolbar': '画像ツールバー',
  'image widget': '画像ウィジェット',
  'Increase indent': 'インデント',
  'Insert column left': '列を左に挿入',
  'Insert column right': '列を右に挿入',
  'Insert image': '画像を挿入',
  'Insert image or file': '画像またはファイルを挿入',
  'Insert media': 'メディアを挿入',
  'Insert row above': '上に行を挿入',
  'Insert row below': '下に行を挿入',
  'Insert table': '表を挿入',
  'Inserting image failed': '画像の挿入に失敗しました',
  Italic: '斜体',
  'Left aligned image': '画像左揃え',
  Link: 'ハイパーリンク',
  'Link URL': 'Web URL',
  'Media URL': 'メディアURL',
  'media widget': 'メディアウィジェット',
  'Merge cell down': '下のセルと結合',
  'Merge cell left': '左のセルと結合',
  'Merge cell right': '右のセルと結合',
  'Merge cell up': '上のセルと結合',
  'Merge cells': 'セルを結合',
  Next: '次へ',
  'Numbered List': '番号付きリスト',
  'Open in a new tab': 'URLを開く',
  'Open link in new tab': 'URLを開く',
  Paragraph: '段落',
  'Paste the media URL in the input.': 'メディアURLを入力欄に貼り付ける',
  Previous: '戻る',
  Redo: 'やり直す',
  'Rich Text Editor': 'リッチテキストエディタ',
  'Rich Text Editor, %0': 'リッチテキストエディタ、 %0',
  'Right aligned image': '画像右揃え',
  Row: '行',
  Save: '保存',
  'Select column': '',
  'Select row': '',
  'Selecting resized image failed': 'サイズ変更の画像の選択に失敗しました',
  'Show more items': 'その他',
  'Side image': '画像サイド表示',
  'Split cell horizontally': 'セルを左右に分割',
  'Split cell vertically': 'セルを上下に分割',
  'Table toolbar': '表ツールバー',
  'Text alternative': '代替テキスト',
  'The URL must not be empty.': 'URLが必須です。',
  'This link has no URL': 'このリンクにURLが設定されていません',
  'This media URL is not supported.': 'このメディアURLには対応していません',
  'Tip: Paste the URL into the content to embed faster.': 'ヒント：URLをコンテンツに貼り付けて、より速く入力します',
  Undo: '元に戻す',
  Unlink: 'ハイパーリンクを解除',
  'Upload failed': 'アップロードに失敗しました',
  'Upload in progress': 'アップロード中',
  'Widget toolbar': 'ウィジェットツールバー',
  Highlight: 'ハイライト',
  'Remove highlight': 'ハイライトを解除',
  Strikethrough: '取り消し線',
  Underline: '下線',
  'Text alignment': '文字列の配置',
  'Align left': '左揃え',
  'Align right': '右揃え',
  'Align center': '中央揃え',
  Justify: '両端揃え',
  'To-do List': 'チェック項目',
  Mention: 'メンション',
  Image: '画像'
});
// translation for dumbo
locale.dictionary = Object.assign(locale.dictionary, {
  '[Task]': '[タスク]',
  '[Document]': '[ドキュメント]',
  'Preview image': '画像プレビュー',
  'Mention resources': 'メンバー、タスクをメンションする',
  'Mention resources task': 'タスクをメンションする',
  Loading: '読み込み中...',
  'Resource Not Found': '一致するメンバーまたはタスクが見つかりません',
  'Resource Not Found Task': '一致するタスクが見つかりません',
  Members: 'メンバー',
  Tasks: 'タスク',
  Docs: 'クラウドドキュメント'
});
locale.getPluralForm = () => 0;
