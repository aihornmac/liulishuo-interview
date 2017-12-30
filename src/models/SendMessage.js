import { observable, action } from 'mobx';
import { ContextualState, injectAsyncAction } from './helpers';

const SEND_LOCK_DURATION = 60 * 1000;

export default class SendMessage extends ContextualState {
  static SEND_LOCK_DURATION = SEND_LOCK_DURATION;
  SEND_LOCK_DURATION = SEND_LOCK_DURATION;

  @observable.ref state;
  @observable.ref number = '';
  @observable.ref error;
  @observable.ref sentAt;

  @action send () {
    if (this.state === 'pending') return;
    const now = Date.now();
    if (this.sentAt && now - this.sentAt < SEND_LOCK_DURATION) {
      return;
    }
    this._send(this.number);
  }

  * _send (number) {
    try {
      this.state = 'pending';
      this.sentAt = Date.now();
      // mock result in development
      if (process.env.NODE_ENV === 'production') {
        try {
          const response = yield fetch(`send-message/${number}`);
          const text = yield response.text();
          if (!response.ok) {
            throw new Error(text);
          }
        } catch (e) {
          throw new Error(`号码不存在`);
        }
      } else {
        yield new Promise(resolve => setTimeout(resolve, 100));
        if (number !== '13800138000') {
          throw new Error(`号码不存在`);
        }
      }
      this.state = 'resolved';
    } catch (e) {
      this.state = 'rejected';
      this.sentAt = null;
      this.error = e;
    }
  }
}

injectAsyncAction(SendMessage.prototype, [
  '_send'
]);
