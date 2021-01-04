import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
} from '@material-ui/core';
import React, { Component, ReactElement } from 'react';
import { UniversalKeymap } from '../../Connectors/Keymap';
import { Shortcut } from '../../Connectors/Shortcut';
import { IShortcutDefinition } from '../../Connectors/ShortcutDefinitions';
import { ShortcutElement } from './shortcut';

type ShortcutsDialogProps = {
  keymap: UniversalKeymap;
  shortcutDefinitions?: IShortcutDefinition;
  onChange: (newKeymap: UniversalKeymap) => void;
  onCancel: () => void;
};

type ShortcutsDialogState = {
  keymap: UniversalKeymap;
};

export class ShortcutsDialog extends Component<
  ShortcutsDialogProps,
  ShortcutsDialogState
> {
  constructor(props: ShortcutsDialogProps) {
    super(props);
    this.state = {
      keymap: props.keymap.clone(),
    };
  }

  static getDerivedStateFromProps(
    props: ShortcutsDialogProps,
    current_state: ShortcutsDialogState
  ): ShortcutsDialogState | null {
    if (!props.shortcutDefinitions) {
      console.log('update');
      return {
        ...current_state,
        keymap: props.keymap.clone(),
      };
    }
    return null;
  }

  private onRemove(shortcut: Shortcut) {
    if (this.props.shortcutDefinitions) {
      const newKemap = this.state.keymap.clone();
      newKemap.remove(this.props.shortcutDefinitions.id, shortcut);
      this.setState({
        ...this.state,
        keymap: newKemap,
      });
    }
  }

  render(): ReactElement {
    const { shortcutDefinitions, onChange, onCancel } = this.props;

    if (shortcutDefinitions)
      return (
        <Dialog
          open={!!shortcutDefinitions}
          onClose={() => onCancel()}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            {shortcutDefinitions.label}
          </DialogTitle>
          <DialogContent>
            {this.state.keymap
              .get(shortcutDefinitions.id)
              .map((shortcut, idx) => (
                <ShortcutsDialogShortcutElement
                  shortcut={shortcut}
                  onRemove={this.onRemove.bind(this)}
                  key={idx}
                ></ShortcutsDialogShortcutElement>
              ))}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => onCancel()} color="primary">
              Cancel
            </Button>
            <Button onClick={() => onChange(this.state.keymap)} color="primary">
              Ok
            </Button>
          </DialogActions>
        </Dialog>
      );
    else return <React.Fragment></React.Fragment>;
  }
}

type ShortcutDialogShortcutElementProps = {
  shortcut: Shortcut;
  onRemove: (shortcut: Shortcut) => void;
};

const ShortcutsDialogShortcutElement = ({
  shortcut,
  onRemove,
}: ShortcutDialogShortcutElementProps): ReactElement => (
  <div>
    <ShortcutElement shortcut={shortcut}></ShortcutElement>
    <Button onClick={() => onRemove(shortcut)}>X</Button>
  </div>
);
