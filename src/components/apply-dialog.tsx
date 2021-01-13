import {
  FormGroup,
  FormControlLabel,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  DialogActions,
  Tooltip,
} from '@material-ui/core';
import React, { Component, ReactElement } from 'react';
import { Ide, IdeType } from '../Connectors/Ide';
import InfoIcon from '@material-ui/icons/InfoOutlined';

type ApplyDialogProps = {
  ides: Ide[];
  onApply: (ides: Ide[]) => void;
  open: boolean;
  onClose: () => void;
};

type ApplyDialogState = {
  selectedIdes: boolean[];
};

export class ApplyDialog extends Component<ApplyDialogProps, ApplyDialogState> {
  constructor(props: ApplyDialogProps) {
    super(props);
    this.state = {
      selectedIdes: props.ides.map(() => true),
    };
  }

  private handleChange = (index: number) => {
    const newSelected = [...this.state.selectedIdes];
    newSelected[index] = !newSelected[index];
    this.setState({ ...this.state, selectedIdes: newSelected });
  };

  static getDerivedStateFromProps(
    props: ApplyDialogProps,
    current_state: ApplyDialogState
  ): ApplyDialogState | null {
    if (current_state.selectedIdes.length !== props.ides.length) {
      return {
        ...current_state,
        selectedIdes: props.ides.map(() => true),
      };
    }
    return null;
  }

  private onApply() {
    this.props.onApply(
      this.props.ides.filter((_ide, idx) => this.state.selectedIdes[idx])
    );
  }

  render(): ReactElement {
    return (
      <Dialog
        open={this.props.open}
        onClose={() => this.props.onClose()}
        className="shortcut-dialog"
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Apply to...</DialogTitle>
        <DialogContent>
          <FormGroup>
            {this.props.ides.map((ide, idx) => (
              <FormControlLabel
                value={this.state.selectedIdes[idx]}
                key={idx}
                control={
                  <Checkbox
                    checked={this.state.selectedIdes[idx]}
                    onChange={() => this.handleChange(idx)}
                    color="primary"
                  />
                }
                label={
                  <>
                    {ide.name}
                    <IdeInfo ide={ide}></IdeInfo>
                  </>
                }
              />
            ))}
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={this.onApply.bind(this)}
            variant="contained"
            color="primary"
          >
            Ok
          </Button>
          <Button
            onClick={() => this.props.onClose()}
            variant="outlined"
            color="primary"
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
type IdeInfoProps = {
  ide: Ide;
};

const IdeInfo = ({ ide }: IdeInfoProps): ReactElement => {
  if (ide.type === IdeType.Jetbrains) {
    return (
      <Tooltip
        title="Jetbrains ides need to be restarted for changes to be applied"
        arrow
      >
        <InfoIcon fontSize="small" className="ide-info"></InfoIcon>
      </Tooltip>
    );
  } else {
    return <></>;
  }
};
