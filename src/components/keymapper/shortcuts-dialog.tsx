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
import { UniversalKeymap } from '../../Connectors/Keymap';
import { Shortcut } from '../../Connectors/Shortcut';
import {
  IShortcutDefinition,
  ShortcutCategories,
} from '../../Connectors/ShortcutDefinitions';
import { ConflictWarning } from './conflict-warning';
import { ShortcutElement } from './shortcut';
import { ShortcutCreatorElement } from './shortcut-creator';

type ShortcutsDialogProps = {
  keymap: UniversalKeymap;
  shortcutCategories: ShortcutCategories;
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
        ...this.state,
        keymap: newKemap,
      });
    }
  }

  private addShortcut(shortcut: Shortcut) {
    if (this.props.shortcutDefinition) {
      const newKemap = this.state.keymap.clone();
      newKemap.add(this.props.shortcutDefinition.id, shortcut);
      this.setState({
        ...this.state,
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
    definition: IShortcutDefinition
  ): IShortcutDefinition[] {
    const keys = this.state.keymap.conflicts(shortcut, definition.id);
    return this.props.shortcutCategories.categories.reduce<
      IShortcutDefinition[]
    >((arr, category) => {
      return arr.concat(
        category.definitions.filter((definition) =>
          keys.includes(definition.id)
        )
      );
    }, []);
  }

  private removeConflict(
    definition: IShortcutDefinition,
    shortcut: Shortcut
  ): void {
    const newKeymap = this.state.keymap.clone();
    newKeymap.remove(definition.id, shortcut);
    this.setState({ ...this.state, keymap: newKeymap });
  }

  render(): ReactElement {
    const { shortcutDefinition: shortcutDefinitions, onCancel } = this.props;
    const isOpened = !!shortcutDefinitions;
    if (shortcutDefinitions)
      return (
        <div>
          <Dialog
            open={isOpened}
            onClose={() => onCancel()}
            className="shortcut-dialog"
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">
              {shortcutDefinitions.label}
            </DialogTitle>
            <DialogContent>
              <TableContainer>
                <Table size="small">
                  <TableBody>
                    {this.state.keymap
                      .get(shortcutDefinitions.id)
                      .map((shortcut, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="keybindings-col">
                            <ConflictWarning
                              defnitions={this.conflictingDefinitions(
                                shortcut,
                                shortcutDefinitions
                              )}
                              onRemove={(def) =>
                                this.removeConflict(def, shortcut)
                              }
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
