import { ThemeProvider } from '@material-ui/core';
import React, { Component, ReactElement } from 'react';
import { Keymapper } from './components/keymapper';
import { Connectors } from './Connectors';
import { Ide } from './Connectors/Ide';
import { themeDark } from './theme';

type AppProps = Record<string, never>;

type AppState = {
  ides: Ide[];
};

export default class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      ides: [],
    };
  }

  // Before the component mounts, we initialise our state
  componentWillMount(): void {
    Connectors.scan().then(async (scannedIdes) => {
      this.setState({
        ...this.state,
        ides: scannedIdes,
      });
    });
  }

  render(): ReactElement {
    return (
      <ThemeProvider theme={themeDark}>
        <Keymapper ides={this.state.ides} />
      </ThemeProvider>
    );
  }
}
