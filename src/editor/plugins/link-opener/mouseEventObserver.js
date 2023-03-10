import DomEventObserver from '@ckeditor/ckeditor5-engine/src/view/observer/domeventobserver';

export default class MouseEventsObserver extends DomEventObserver {
  constructor(view) {
    super(view);
    this.domEventType = ['mousemove'];
  }

  onDomEvent(domEvent) {
    this.fire(domEvent.type, domEvent);
  }
}
