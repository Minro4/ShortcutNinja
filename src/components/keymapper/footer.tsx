import { Box, Button, CircularProgress, Snackbar } from '@material-ui/core';
import React, { Component, ReactElement } from 'react';
import { Ide } from '../../Connectors/Ide';
import { UniversalKeymap } from '../../Connectors/Keymap';
import GetAppIcon from '@material-ui/icons/GetApp';
import SendIcon from '@material-ui/icons/Send';
import { ApplyDialog } from './apply-dialog';
import MuiAlert from '@material-ui/lab/Alert';
import { ImportDialog } from './importDialog';

type FooterProps = {
  ides: Ide[];
  keymap: UniversalKeymap;
  importDialogOpened: boolean;
  onImport: (ide: Ide) => void;
  onOpenImport: ()=>void
  onCloseImport: () => void;
};

type FooterState = {
  applyOpened: boolean;
  applyLoading: boolean;
  snackbarOpened: boolean;
};

export class Footer extends Component<FooterProps, FooterState> {
  constructor(props: FooterProps) {
    super(props);

    this.state = {
      applyOpened: false,
      applyLoading: false,
      snackbarOpened: false,
    };
  }

  render(): ReactElement {
    return (
      <Box className="bottom-bar">
        <Button
          variant="outlined"
          color="primary"
          startIcon={<GetAppIcon />}
          onClick={this.props.onOpenImport}
        >
          Import
        </Button>
        <Button
          className="apply-button"
          variant="contained"
          color="primary"
          endIcon={!this.state.applyLoading && <SendIcon />}
          onClick={this.onApply.bind(this)}
          disabled={this.state.applyLoading}
        >
          {this.state.applyLoading ? <CircularProgress size={20} /> : 'Apply'}
        </Button>
        <ApplyDialog
          ides={this.props.ides}
          open={this.state.applyOpened}
          onApply={this.apply.bind(this)}
          onClose={this.closeApply.bind(this)}
        ></ApplyDialog>
        <ImportDialog
          open={this.props.importDialogOpened}
          onSelect={this.props.onImport}
          onClose={this.props.onCloseImport}
          ides={this.props.ides}
        ></ImportDialog>
        <Snackbar
          open={this.state.snackbarOpened}
          autoHideDuration={4000}
          onClose={() => this.setSnackbar(false)}
        >
          <MuiAlert severity="success" variant="filled">
            Shortcuts successfully applied!
          </MuiAlert>
        </Snackbar>
      </Box>
    );
  }

  private onApply() {
    this.setState({ ...this.state, applyOpened: true });
  }

  private apply(ides: Ide[]) {
    Promise.all(
      ides.map((ide) => ide.converter.save(this.props.keymap.clone()))
    ).then((results) => {
      this.setState({ ...this.state, applyLoading: false });
      if (results.some((result) => result)) {
        this.setSnackbar(true);
      } else {
        console.log('fail');
      }
    });
    this.setState({
      ...this.state,
      applyOpened: false,
      applyLoading: true,
    });
  }

  private closeApply() {
    this.setState({ ...this.state, applyOpened: false });
  }

  private setSnackbar(value: boolean) {
    this.setState({ ...this.state, snackbarOpened: value });
  }
}
