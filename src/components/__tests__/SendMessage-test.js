import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import SendMessage, { InputDOM, ButtonDOM, ErrorDOM } from '../SendMessage';

describe('<SendMessage />', () => {
  it('renders props.number in input', () => {
    const $root = shallow(
      <SendMessage
        number="test number"
      />
    );

    const $input = $root.find(InputDOM);

    expect($input.exists()).to.be.true;
    expect($input.props().value).to.equal('test number');
  });

  it('show props.errorText if props.styleState = "error"', () => {
    /* eslint-disable indent */
    for (const [
      styleState, errorText
    ] of [
      [null, 'test error text'],
      ['error', 'test error text'],
      [null, null],
      ['error', null],
    ]) {
    /* eslint-enable indent */
      const $root = shallow(
        <SendMessage
          styleState={styleState}
          errorText={errorText}
        />
      );

      const $error = $root.find(ErrorDOM);

      if (styleState === 'error') {
        expect($error.exists()).to.be.true;
        expect($error.props().children).to.equal(errorText);
      } else {
        expect($error.exists()).to.be.false;
      }
    }
  });

  it('renders props.sendText in send button', () => {
    const $root = shallow(
      <SendMessage
        sendText="test send text"
      />
    );

    const $button = $root.find(ButtonDOM);

    expect($button.exists()).to.be.true;
    expect($button.props().children).to.equal('test send text');
  });

  it('props.onNumberChange is triggered when number input changes if not props.numberDisabled', () => {
    /* eslint-disable indent */
    for (const [
      numberDisabled
    ] of [
      [undefined],
      [false],
      [true],
    ]) {
    /* eslint-enable indent */
      let isTriggered = false;
      let value;

      const onNumberChange = e => {
        isTriggered = true;
        value = e.target.value;
      };

      const $root = shallow(
        <SendMessage
          numberDisabled={numberDisabled}
          onNumberChange={onNumberChange}
        />
      );

      const $input = $root.find(InputDOM);

      expect($input.exists()).to.be.true;
      $input.simulate('change', { target: { value: 'test number' } });

      if (numberDisabled) {
        expect(isTriggered).to.be.false;
      } else {
        expect(isTriggered).to.be.true;
        expect(value).to.equal('test number');
      }
    }
  });

  it('props.onSend is triggered when number input changes if not props.sendDisabled', () => {
    /* eslint-disable indent */
    for (const [
      sendDisabled
    ] of [
      [undefined],
      [false],
      [true],
    ]) {
    /* eslint-enable indent */
      let isTriggered = false;

      const onSend = () => {
        isTriggered = true;
      };

      const $root = shallow(
        <SendMessage
          sendDisabled={sendDisabled}
          onSend={onSend}
        />
      );

      const $button = $root.find(ButtonDOM);

      expect($button.exists()).to.be.true;
      $button.simulate('click');

      if (sendDisabled) {
        expect(isTriggered).to.be.false;
      } else {
        expect(isTriggered).to.be.true;
      }
    }
  });
});
