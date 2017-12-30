import React from 'react';
import styled from 'styled-components';

export default function SendMessage (props) {
  const {
    number = '',
    sendText = '发送',
    numberDisabled = false,
    sendDisabled = false,
    styleState,
    errorText,
  } = props;

  return (
    <div>
      <ContainerDOM key="container">
        <InputDOM
          key="input number"
          disabled={numberDisabled}
          value={number}
          onChange={!numberDisabled && props.onNumberChange || undefined}
        />
        <ButtonDOM
          key="send button"
          role="button"
          aria-disabled={sendDisabled}
          className={sendDisabled && 'disabled'}
          onClick={!sendDisabled && props.onSend || undefined}
        >
          {sendText}
        </ButtonDOM>
      </ContainerDOM>
      {styleState === 'error' && (
        <ErrorDOM key="error">
          {errorText}
        </ErrorDOM>
      )}
    </div>
  );
}

export const ContainerDOM = styled.div`
  display: flex;
`;

export const InputDOM = styled.input`
  flex: 1 1 auto;
  appearance: none;
  padding: .5em;
  border: 1px solid #ddd;
  transition: all .25s ease;
  outline: 0;

  :not([disabled]) {
    &:hover, &:focus {
      border-color: #108ee9;
    }
  }
`;

export const ButtonDOM = styled.a`
  flex: 0 0 auto;
  position: relative;
  padding: .5em 1em;
  text-align: center;
  color: #fff;
  background-color: #108ee9;
  border: 1px solid #108ee9;
  transition: all .25s ease;
  outline: 0;
  user-select: none;
  cursor: pointer;

  &.disabled {
    opacity: .5;
    cursor: not-allowed;
  }

  :not(.disabled) {
    &:hover, &:focus {
      background-color: #1284d6;
      border-color: #1284d6;
    }
  }
`;

export const ErrorDOM = styled.div`
  margin-top: .5em;
  font-size: .75em;
  color: red;
`;
