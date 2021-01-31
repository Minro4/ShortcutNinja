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
  Tooltip,
} from '@material-ui/core';
import RemoveIcon from '@material-ui/icons/Remove';
import React, { Component, ReactElement } from 'react';
import { UniversalKeymap } from '../Connectors/Keymap';
import { Shortcut } from '../Connectors/Shortcut';
import {
  IShortcutDefinition,
  ShortcutCategories,
} from '../Connectors/ShortcutDefinitions';
import { ConflictWarning, IShortcutConflict } from './conflict-warning';
import { ShortcutElement, ShortcutLabel } from './shortcut';
import { ShortcutCreatorElement } from './shortcut-creator';

type ShortcutsDialogProps = {
  keymap: UniversalKeymap;
  shortcutDefinition?: IShortcutDefinition;
  onChange: (newKeymap: UniversalKeymap) => void;
  onCancel: () => void;
};

type ShortcutsDialogState = {
  keymap: UniversalKeymap;
  onOkSubs: (() => Shortcut | undefined)[];
};

export class ShortcutsDialog extends Component<
  ShortcutsDialogProps,
  ShortcutsDialogState
> {
  constructor(props: ShortcutsDialogProps) {
    super(props);
    this.state = {
      keymap: props.keymap.clone(),
      onOkSubs: [],
    };
  }

  static getDerivedStateFromProps(
    props: ShortcutsDialogProps,
    current_state: ShortcutsDialogState
  ): ShortcutsDialogState | null {
    if (!props.shortcutDefinition) {
      return {
        ...current_state,
        keymap: props.keymap.clone(),
        onOkSubs: [],
      };
    }
    return null;
  }

  private onRemove(shortcut: Shortcut) {
    if (this.props.shortcutDefinition) {
      const newKemap = this.state.keymap.clone();
      newKemap.remove(this.props.shortcutDefinition.id, shortcut);
      this.setState({
        keymap: newKemap,
      });
    }
  }

  private addShortcut(shortcut: Shortcut) {
    if (this.props.shortcutDefinition) {
      const newKemap = this.state.keymap.clone();
      newKemap.add(this.props.shortcutDefinition.id, shortcut);
      this.setState({
        keymap: newKemap,
      });
    }
  }

  private onOk() {
    const keymap = this.state.keymap;
    this.state.onOkSubs.forEach((sub) => {
      if (this.props.shortcutDefinition) {
        const sc = sub();
        if (sc) keymap.add(this.props.shortcutDefinition.id, sc);
      }
    });
    this.props.onChange(keymap);
  }

  private addOnOkSubscriber(fct: () => Shortcut | undefined) {
    this.state.onOkSubs.push(fct);
  }

  private conflictingDefinitions(
    shortcut: Shortcut,
    shortcutDefinition: IShortcutDefinition
  ): IShortcutConflict[] {
    const conflicts = this.state.keymap.conflicts(
      shortcut,
      shortcutDefinition.id
    );

    return ShortcutCategories.baseCategories
      .flatten()
      .filter((definition) => conflicts.keys().includes(definition.id))
      .map<IShortcutConflict>((definition) => ({
        definition,
        shortcuts: conflicts.get(definition.id),
      }));
  }

  private removeConflict(conflict: IShortcutConflict): void {
    const newKeymap = this.state.keymap.clone();
    newKeymap.removeAll(conflict.definition.id, conflict.shortcuts);
    this.setState({ keymap: newKeymap });
  }

  render(): ReactElement {
    const { shortcutDefinition, onCancel } = this.props;
    const isOpened = !!shortcutDefinition;
    if (shortcutDefinition)
      return (
        <div>
          <Dialog
            open={isOpened}
            onClose={() => onCancel()}
            className="shortcut-dialog"
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">
              <ShortcutLabel definition={shortcutDefinition}></ShortcutLabel>
            </DialogTitle>
            <DialogContent>
              <TableContainer>
                <Table size="small">
                  <TableBody>
                    {this.state.keymap
                      .get(shortcutDefinition.id)
                      .map((shortcut, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="keybindings-col">
                            <ConflictWarning
                              conflicts={this.conflictingDefinitions(
                                shortcut,
                                shortcutDefinition
                              )}
                              onRemove={this.removeConflict.bind(this)}
                            ></ConflictWarning>

                            <ShortcutElement
                              shortcut={shortcut}
                            ></ShortcutElement>
                          </TableCell>
                          <TableCell>
                            <Tooltip title="Remove" arrow>
                              <IconButton
                                onClick={() => this.onRemove(shortcut)}
                              >
                                <RemoveIcon fontSize="small"></RemoveIcon>
                              </IconButton>
                            </Tooltip>
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
              <Button
                onClick={this.onOk.bind(this)}
                variant="contained"
                color="primary"
              >
                Ok
              </Button>
              <Button onClick={onCancel} variant="outlined" color="primary">
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      );
    else return <React.Fragment></React.Fragment>;
  }
}
