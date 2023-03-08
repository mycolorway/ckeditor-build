function isWidget(node) {
  if (!node.is('element')) return false;
  return !!node.getCustomProperty('image');
}

export function isImageViewerWidget(viewElement, modelElement, schema) {
  return viewElement && isWidget(viewElement) && !schema.isInline(modelElement);
}

export function injectUIIntoWidget(viewWriter, title, widgetViewElement) {
  viewWriter.insert(
    viewWriter.createPositionAt(widgetViewElement, 'end'),
    viewWriter.createUIElement('div', {
      class: 'ck ck-image-viewer__button',
      title,
    }),
  );
}
