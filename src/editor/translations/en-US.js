const translations =
  window.CKEDITOR_TRANSLATIONS || (window.CKEDITOR_TRANSLATIONS = {});
translations['en-US'] = translations['en-US'] || {};
const locale = translations['en-US'];
locale.dictionary = Object.assign(locale.dictionary || {}, {
  '%0 of %1': 'Step %0 of %1',
  'Block quote': 'Block quote',
  Bold: 'Bold',
  'Bulleted List': 'Bullet list',
  Cancel: 'Cancel',
  'Cannot upload file:': 'Failed to upload file: ',
  'Centered image': 'Center align image',
  'Change image text alternative': 'Change image text alternative',
  'Choose heading': 'Aa',
  Column: 'Column',
  'Could not insert image at the current position.':
    'Failed to insert image in current position',
  'Could not obtain resized image URL.':
    'Failed to get link for the resized image',
  'Decrease indent': 'Decrease indent',
  'Delete column': 'Delete column',
  'Delete row': 'Delete row',
  Downloadable: 'Downloadable',
  'Dropdown toolbar': 'Dropdown toolbar',
  'Edit link': 'Edit link',
  'Editor toolbar': 'Editor toolbar',
  'Enter image caption': 'Enter image title',
  'Full size image': 'Full screen',
  'Header column': 'Header column',
  'Header row': 'Header row',
  Heading: 'Title',
  'Heading 1': 'Heading 1',
  'Heading 2': 'Heading 2',
  'Heading 3': 'Heading 3',
  'Heading 4': 'Heading 4',
  'Heading 5': 'Heading 5',
  'Heading 6': 'Heading 6',
  'Image toolbar': 'Image toolbar',
  'image widget': 'Image widget',
  'Increase indent': 'Increase indent',
  'Insert column left': 'Insert 1 column left',
  'Insert column right': 'Insert 1 column right',
  'Insert image': 'Insert image',
  'Insert image or file': 'Insert image or file',
  'Insert media': 'Insert media',
  'Insert row above': 'Insert 1 row above',
  'Insert row below': 'Insert 1 row below',
  'Insert table': 'Insert table',
  'Inserting image failed': 'Failed to insert image',
  Italic: 'Italic',
  'Left aligned image': 'Left align image',
  Link: 'Link',
  'Link URL': 'Link URL',
  'Media URL': 'Media URL',
  'media widget': 'Media widget',
  'Merge cell down': 'Merge cells down',
  'Merge cell left': 'Merge cells left',
  'Merge cell right': 'Merge cells right',
  'Merge cell up': 'Merge cells up',
  'Merge cells': 'Merge cells',
  Next: 'Next',
  'Numbered List': 'Numbered list',
  'Open in a new tab': 'Open link',
  'Open link in new tab': 'Open link',
  Paragraph: 'Paragraph',
  'Paste the media URL in the input.': 'Paste media URL in the input box',
  Previous: 'Previous',
  Redo: 'Redo',
  'Rich Text Editor': 'Rich text editor',
  'Rich Text Editor, %0': 'Rich text editor, %0',
  'Right aligned image': 'Right align image',
  Row: 'Row',
  Save: 'Save',
  'Select column': '',
  'Select row': '',
  'Selecting resized image failed': 'Failed to select resized image',
  'Show more items': 'More',
  'Side image': 'Side image',
  'Split cell horizontally': 'Split cell horizontally',
  'Split cell vertically': 'Split cell vertically',
  'Table toolbar': 'Table toolbar',
  'Text alternative': 'Alt text',
  'The URL must not be empty.': 'Link cannot be empty.',
  'This link has no URL': 'No URL set for this link',
  'This media URL is not supported.': 'This media URL is not supported.',
  'Tip: Paste the URL into the content to embed faster.':
    'Tip: Paste link into content for faster embedding',
  Undo: 'Undo',
  Unlink: 'Remove link',
  'Upload failed': 'Upload failed',
  'Upload in progress': 'Uploading',
  'Widget toolbar': 'Widget toolbar',
  Highlight: 'Highlight',
  'Remove highlight': 'Remove highlight',
  Strikethrough: 'Strikethrough',
  Underline: 'Underline',
  'Text alignment': 'Align',
  'Align left': 'Left align',
  'Align right': 'Right align',
  'Align center': 'Center align',
  Justify: 'Justify',
  'To-do List': 'To-do list',
  Mention: 'Mention',
  Image: 'Image',
});

// translation for dumbo
locale.dictionary = Object.assign(locale.dictionary, {
  '[Task]': 'Task',
  '[Document]': 'Document',
  'Preview image': 'Preview',
  'Mention resources': 'Mention members or tasks',
  'Mention resources task': 'Mention tasks',
  Loading: 'Loading...',
  'Resource Not Found': 'No matching member or task',
  'Resource Not Found Task': 'No matching task',
  Members: 'Member',
  Tasks: 'Task',
  Docs: 'Cloud documents',
});

locale.getPluralForm = (n) => (n === 1 ? 0 : 1);
