import LabelView from '@ckeditor/ckeditor5-ui/src/label/labelview';

export default class LabelViewWithIcon extends LabelView {
  constructor(locale, icon) {
    super(locale);

    const bind = this.bindTemplate;
    this.setTemplate({
      tag: 'label',
      attributes: {
        class: [
          'ck',
          'ck-label',
        ],
        id: this.id,
        for: bind.to('for'),
      },
      children: [
        icon,
        {
          text: bind.to('text'),
        },
      ],
    });
  }
}
