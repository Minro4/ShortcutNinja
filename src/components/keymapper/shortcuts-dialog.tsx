import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
} from '@material-ui/core';
import RemoveIcon from '@material-ui/icons/Remove';
import React, { Component, ReactElement } from 'react';
import { UniversalKeymap } from '../../Connectors/Keymap';
import { Shortcut } from '../../Connectors/Shortcut';
import { IShortcutDefinition } from '../../Connectors/ShortcutDefinitions';
import { ShortcutElement } from './shortcut';
import { ShortcutCreatorElement } from './shortcut-creator';

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
  private onOkSubs: (() => Shortcut | undefined)[] = [];

  constructor(props: ShortcutsDialogProps) {
    super(props);
    this.state = {
      keymap: props.keymap.clone(),
    };
  }

  componentWillUnmount(): void {
    this.onOkSubs = [];
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

  private addShortcut(shortcut: Shortcut) {
    if (this.props.shortcutDefinitions) {
      const newKemap = this.state.keymap.clone();
      newKemap.add(this.props.shortcutDefinitions.id, shortcut);
      this.setState({
        ...this.state,
        keymap: newKemap,
      });
    }
  }

  private onOk() {
    const keymap = this.state.keymap;
    this.onOkSubs.forEach((sub) => {
      if (this.props.shortcutDefinitions) {
        const sc = sub();
        if (sc) keymap.add(this.props.shortcutDefinitions.id, sc);
      }
    });
    this.props.onChange(keymap);
  }

  private addOnOkSubscriber(fct: () => Shortcut | undefined) {
    this.onOkSubs.push(fct);
  }

  render(): ReactElement {
    const { shortcutDefinitions, onCancel } = this.props;
    const isOpened = !!shortcutDefinitions;
    if (shortcutDefinitions)
      return (
        <div>
          <Dialog
            open={isOpened}
            onClose={() => onCancel()}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">
              {shortcutDefinitions.label}
            </DialogTitle>
            <DialogContent>
              <TableContainer>
                <Table>
                  <TableBody>
                    {this.state.keymap
                      .get(shortcutDefinitions.id)
                      .map((shortcut, idx) => (
                        <TableRow key={idx}>
                          <TableCell>
                            <ShortcutElement
                              shortcut={shortcut}
                            ></ShortcutElement>
                          </TableCell>
                          <TableCell>
                            <IconButton onClick={() => this.onRemove(shortcut)}>
                              <RemoveIcon></RemoveIcon>
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    <ShortcutCreatorElement
                      open={isOpened}
                      addShortcut={this.addShortcut.bind(this)}
                      onOkSubscribe={this.addOnOkSubscriber.bind(this)}
                    ></ShortcutCreatorElement>
                  </TableBody>
                </Table>
              </TableContainer>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.onOk.bind(this)} color="primary">
                Ok
              </Button>
              <Button onClick={onCancel} color="primary">
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      );
    else return <React.Fragment></React.Fragment>;
  }
}
