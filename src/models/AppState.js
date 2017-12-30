import { ContextualState } from './helpers';

import SendMessage from './SendMessage';
import Clock from './Clock';

export default class AppState extends ContextualState {
  sendMessage = SendMessage.new({}, this);
  clock = new Clock();

  initialize () {
    this.on('destroy', () => {
      this.sendMessage.destroy();
    });
  }
}
