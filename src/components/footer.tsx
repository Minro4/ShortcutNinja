import { Box, Button, CircularProgress, Snackbar } from '@material-ui/core';
import React, { Component, ReactElement } from 'react';
import { Ide } from '../Connectors/Ide';
import { UniversalKeymap } from '../Connectors/Keymap';
import GetAppIcon from '@material-ui/icons/GetApp';
import SendIcon from '@material-ui/icons/Send';
import { ApplyDialog } from './apply-dialog';
import MuiAlert from '@material-ui/lab/Alert';
import { ImportDialog } from './import-dialog';

type FooterProps = {
  ides: Ide[];
  keymap: UniversalKeymap;
  onImport: (ide: Ide) => void;
};

type FooterState = {
  applyOpened: boolean;
  applyLoading: boolean;
  snackbarOpened: boolean;
  importOpened: boolean;
};

export class Footer extends Component<FooterProps, FooterState> {
  constructor(props: FooterProps) {
    super(props);

    this.state = {
      applyOpened: false,
      applyLoading: false,
      snackbarOpened: false,
      importOpened: false,
    };
  }

  render(): ReactElement {
    return (
      <Box className="footer">
        <Box className="bottom-bar">
          <Button
            variant="contained"
            color="primary"
            startIcon={<GetAppIcon />}
            onClick={() => this.setImportDialogOpen(true)}
          >
            Import
          </Button>
          <div className="apply-button loader-wrapper">
            <Button
              variant="contained"
              color="primary"
              endIcon={<SendIcon />}
              onClick={this.onApply.bind(this)}
              disabled={this.state.applyLoading}
            >
              Apply
            </Button>
            {this.state.applyLoading && (
              <CircularProgress size={24} className="button-loading" />
            )}
          </div>
          <ApplyDialog
            ides={this.props.ides}
            open={this.state.applyOpened}
            onApply={this.apply.bind(this)}
            onClose={this.closeApply.bind(this)}
          ></ApplyDialog>
          <ImportDialog
            open={this.state.importOpened}
            onSelect={this.onImport.bind(this)}
            onClose={() => this.setImportDialogOpen(false)}
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
      </Box>
    );
  }

  private onApply() {
    this.setState({ applyOpened: true });
  }

  private apply(ides: Ide[]) {
    Promise.all(
      ides.map((ide) => ide.converter.save(this.props.keymap.clone()))
    ).then((results) => {
      this.setState({ applyLoading: false });
      if (results.some((result) => result)) {
        this.setSnackbar(true);
      } else {
        console.log('fail');
      }
    });
    this.setState({
      applyOpened: false,
      applyLoading: true,
    });
  }

  private onImport(ide: Ide) {
    this.props.onImport(ide);
    this.setImportDialogOpen(false);
  }

  private closeApply() {
    this.setState({ applyOpened: false });
  }

  private setSnackbar(value: boolean) {
    this.setState({ snackbarOpened: value });
  }

  private setImportDialogOpen(value: boolean) {
    this.setState({ importOpened: value });
  }
}
