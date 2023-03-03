import { Plugin } from "@ckeditor/ckeditor5-core";
import ButtonView from "@ckeditor/ckeditor5-ui/src/button/buttonview";

class TimeStamp extends Plugin {
  init() {
    const { editor } = this;

    editor.ui.componentFactory.add('timeStamp', locale => {
      const button = new ButtonView();

      button.set({
        label: '戳',
        withText: true,
        tooltip: true,
      });

      button.on('execute', () => {
        const date = new Date();
        const time = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
        editor.model.change(writer => {
          editor.model.insertContent(writer.createText(time));
        });
      });

      return button;
    });
  }
}

export default TimeStamp;