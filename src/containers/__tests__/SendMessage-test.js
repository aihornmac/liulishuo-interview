import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { observable } from 'mobx';
import SendMessageContainer from '../SendMessage';
import SendMessage from '../../components/SendMessage';
import _ from 'lodash';

describe('<SendMessageContainer />', () => {
  it('phone number should be 11 digits', () => {
    const phone1 = '1234567890123';
    const phones1 = _.times(phone1.length, i => phone1.slice(0, i + 1));
    const phone2 = 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4';
    const phones2 = _.times(phone2.length, i => phone2.slice(0, i + 1));
    for (const [isValid, list] of [
      [true, [
        ...phones1.filter(x => x.length === 11),
      ]],
      [false, [
        ...phones1.filter(x => x.length !== 11),
        ...phones2,
      ]],
    ]) {
      for (const number of list) {
        const clock = makeClock();
        const sendMessage = makeSendMessage();

        sendMessage.number = number;

        const $root = shallow(
          <SendMessageContainer
            clock={clock}
            sendMessage={sendMessage}
          />
        );

        const instance = $root.instance();

        if (isValid) {
          expect(instance.inputError).to.be.undefined;
        } else {
          expect(instance.inputError).to.have.string('11');
        }
      }
    }
  });

  it('when click send, show input error and fetch if no input error', () => {
    const clock = makeClock();
    const sendMessage = makeSendMessage();

    let isTriggered = false;

    sendMessage.send = () => {
      isTriggered = true;
    };

    const $root = shallow(
      <SendMessageContainer
        clock={clock}
        sendMessage={sendMessage}
      />
    );

    const $sm = $root.find(SendMessage);

    expect($sm.exists()).to.be.true;

    const instance = $root.instance();

    expect(instance.showInputError).to.be.false;
    expect(isTriggered).to.be.false;

    $sm.prop('onSend')();

    expect(instance.showInputError).to.be.true;
    expect(instance.inputError).to.not.be.empty;
    expect(isTriggered).to.be.false;

    sendMessage.number = '12345678901';

    $sm.prop('onSend')();

    expect(instance.showInputError).to.be.true;
    expect(instance.inputError).to.be.undefined;
    expect(isTriggered).to.be.true;
  });

  it('when number changes, set props.sendMessage.number, hide input error and sync fetch error', () => {
    const clock = makeClock();
    const sendMessage = makeSendMessage();

    const $root = shallow(
      <SendMessageContainer
        clock={clock}
        sendMessage={sendMessage}
      />
    );

    const $sm = $root.find(SendMessage);

    expect($sm.exists()).to.be.true;

    const instance = $root.instance();
    instance.showInputError = true;

    expect(instance.fetchError).to.not.equal(sendMessage.error);

    $sm.prop('onNumberChange')({ target: { value: 'test number change' } });

    expect(sendMessage.number).to.equal('test number change');
    expect(instance.showInputError).to.be.false;
    expect(instance.fetchError).to.equal(sendMessage.error);
  });
});

function makeClock () {
  return {
    get now () {
      return Date.now();
    }
  };
}

function makeSendMessage () {
  return observable({
    number: observable.ref(''),
    error: observable.ref(new Error(`test error`)),
  });
}
