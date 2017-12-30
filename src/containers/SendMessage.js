import React from 'react';
import { observable, computed, action } from 'mobx';
import { observer } from 'mobx-react';
import { mobxize } from '../helpers/react-helpers';

import SendMessage from '../components/SendMessage';

@observer
@mobxize
export default class SendMessageContainer extends React.Component {
  @observable.ref sendMessage;
  @observable.ref clock;
  @observable.ref showInputError = false;
  @observable.ref fetchError;

  applyProps (props) {
    this.sendMessage = props.sendMessage;
    this.clock = props.clock;
  }

  @action onNumberChange = e => {
    this.showInputError = false;
    this.fetchError = this.sendMessage.error;
    this.sendMessage.number = e.target.value;
  }

  @computed get secondsAfterSent () {
    const { sendMessage, clock } = this;
    if (sendMessage.sentAt) {
      return Math.floor((clock.now - sendMessage.sentAt) / 1000);
    }
    return 0;
  }

  @computed get restSeconds () {
    return Math.max(0, this.sendMessage.SEND_LOCK_DURATION / 1000 - this.secondsAfterSent);
  }

  @computed get sendDisabled () {
    const { state } = this.sendMessage;
    if (state === 'resolved') {
      if (this.restSeconds) return true;
    }
    if (state === 'pending') return true;
    return false;
  }

  @computed get styleState () {
    if (this.errorText) return 'error';
  }

  @computed get errorText () {
    const { sendMessage } = this;
    if (this.showInputError && this.inputError) {
      return this.inputError;
    }
    if (sendMessage.state === 'rejected') {
      if (this.fetchError !== sendMessage.error) {
        return String(sendMessage.error);
      }
    }
  }

  @computed get inputError () {
    const { sendMessage } = this;
    if (!sendMessage.number.match(REGEX_NUMBER)) {
      return `号码格式为11位数字`;
    }
  }

  @computed get sendText () {
    const { state } = this.sendMessage;
    if (state === 'pending') {
      return '正在发送...';
    }
    if (state === 'resolved') {
      const { restSeconds } = this;
      if (restSeconds) {
        return `重新发送 (${restSeconds}s)`;
      }
      return `重新发送`;
    }
    return '发送';
  }

  @action onSend = () => {
    this.showInputError = true;
    if (this.inputError) return;
    this.sendMessage.send();
  }

  render () {
    return (
      <div>
        <div key="note" style={{ marginBottom: '1em' }}>
          注: 由于提交的是静态文件, 模拟合法的手机号为13800138000
        </div>
        <SendMessage
          key="send message"
          styleState={this.styleState}
          errorText={this.errorText}
          number={this.sendMessage.number}
          onNumberChange={this.onNumberChange}
          sendDisabled={this.sendDisabled}
          onSend={this.onSend}
          sendText={this.sendText}
        />
      </div>
    );
  }
}

const REGEX_NUMBER = /^[0-9]{11}$/;
