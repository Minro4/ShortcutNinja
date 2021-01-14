import { IconButton, TableCell, TableRow, Tooltip } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import React, { Component, ReactElement } from 'react';
import { ShortcutCreator } from '../Connectors';
import { Shortcut } from '../Connectors/Shortcut';
import { BlinkingCursor } from './blinking-cursor';
import { ShortcutKeyListElement } from './shortcut';

type ShortcutCreatorProps = {
  addShortcut: (shortcut: Shortcut) => void;
  open: boolean;
  onOkSubscribe: (fct: () => Shortcut | undefined) => void;
};

type ShortcutCreatorState = {
  shortcutCreator: ShortcutCreator;
  isOpen: boolean;
};

export class ShortcutCreatorElement extends Component<
  ShortcutCreatorProps,
  ShortcutCreatorState
> {
  constructor(props: ShortcutCreatorProps) {
    super(props);
    this.state = {
      shortcutCreator: new ShortcutCreator(),
      isOpen: props.open,
    };
    props.onOkSubscribe(() => this.state.shortcutCreator.create());
  }

  componentDidMount(): void {
    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('keyup', this.handleKeyUp);
  }

  componentWillUnmount(): void {
    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('keyup', this.handleKeyUp);
  }

  static getDerivedStateFromProps(
    props: ShortcutCreatorProps,
    current_state: ShortcutCreatorState
  ): ShortcutCreatorState | null {
    if (!current_state.isOpen && props.open) {
      return {
        ...current_state,
        isOpen: props.open,
        shortcutCreator: new ShortcutCreator(),
      };
    }
    return null;
  }

  private handleKeyDown = ((e: KeyboardEvent): void => {
    const enter = this.state.shortcutCreator.onKeydown(e.key);
    if (enter) {
      this.createShortcut();
    } else {
      this.updateShortcutCreator();
    }
    e.preventDefault();
  }).bind(this);

  private handleKeyUp = ((e: KeyboardEvent): void => {
    this.state.shortcutCreator.onKeyup(e.key);
    this.updateShortcutCreator();
    e.preventDefault();
  }).bind(this);

  private createShortcut() {
    const shortcut = this.state.shortcutCreator.create();
    if (shortcut) {
      this.props.addShortcut(shortcut);
      this.resetCreator();
    } else {
      //TODO show error or something
    }
  }

  private resetCreator() {
    this.setState({
      shortcutCreator: new ShortcutCreator(),
    });
  }

  private updateShortcutCreator() {
    this.setState({
      shortcutCreator: this.state.shortcutCreator.clone(),
    });
  }

  render(): ReactElement {
    const { shortcutCreator } = this.state;

    return (
      <TableRow>
        <TableCell className="keybindings-col">
          <ShortcutCreatorElementView
            shortcutCreator={shortcutCreator}
          ></ShortcutCreatorElementView>
          <BlinkingCursor></BlinkingCursor>
        </TableCell>
        <TableCell>
          <Tooltip title="Add" arrow>
            <IconButton onClick={this.createShortcut.bind(this)}>
              <AddIcon fontSize="small"></AddIcon>
            </IconButton>
          </Tooltip>
          <Tooltip title="Reset" arrow>
            <IconButton onClick={this.resetCreator.bind(this)}>
              <RemoveIcon fontSize="small"></RemoveIcon>
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
    );
  }
}

type ShortcutCreatorElementViewProps = {
  shortcutCreator: ShortcutCreator;
};

const ShortcutCreatorElementView = ({
  shortcutCreator,
}: ShortcutCreatorElementViewProps): ReactElement => (
  <ShortcutKeyListElement
    kbKeys1={shortcutCreator.sc1Keys()}
    kbKeys2={shortcutCreator.sc2Keys()}
  ></ShortcutKeyListElement>
);
