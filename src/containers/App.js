import React from 'react';
import styled from 'styled-components';

import SendMessage from './SendMessage';

export default class App extends React.Component {
  render () {
    const { app } = this.props;
    return (
      <AppDOM>
        <SendMessage
          sendMessage={app.sendMessage}
          clock={app.clock}
        />
      </AppDOM>
    );
  }
}

const AppDOM = styled.div`
  padding: 1em;
`;
