import { ThemeProvider } from '@material-ui/core';
import React, { Component, ReactElement } from 'react';
import { Keymapper } from './components/keymapper/keymapper';
import { Connectors } from './Connectors';
import { Ide } from './Connectors/Ide';
import { UniversalKeymap } from './Connectors/Keymap';
import { themeDark } from './theme';

type AppProps = Record<string, never>;

type AppState = {
  ides: Ide[];
  keymap: UniversalKeymap;
  showKeymap: boolean;
};

export default class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      ides: [],
      keymap: new UniversalKeymap(),
      showKeymap: false,
    };
  }

  // Before the component mounts, we initialise our state
  componentWillMount(): void {
    Connectors.scan().then(async (scannedIdes) => {
      this.setState({
        ...this.state,
        ides: scannedIdes,
      });
      console.log(scannedIdes);
      scannedIdes[0].converter.load().then((keymap) => {
        console.log(keymap);
        this.setState({
          ...this.state,
          keymap,
          showKeymap: true,
        });
      });
    });
  }

  render(): ReactElement {
    return (
      <ThemeProvider theme={themeDark}>
        <div>
          {this.state.showKeymap && (
            <Keymapper ides={this.state.ides} keymap={this.state.keymap} />
          )}
        </div>
      </ThemeProvider>
    );
  }
}
