import React, { Component, ReactElement } from 'react'; // let's also import Component
import { Ide } from '../../Connectors/Ide';
import { Schema, SchemaTypes } from '../../Connectors/Schema/Schema';
import { LoadSchema } from '../../Connectors/Schema/SchemaLoader';
import {
  IShortcutDefinition,
  ShortcutCategories,
} from '../../Connectors/ShortcutDefinitions';
import { UniversalKeymap } from '../../Connectors/Keymap';
import { KeymapTable } from './keymap-table';
import { SchemaSelector } from './schema-selector';
import { ShortcutsDialog } from './shortcuts-dialog';
import { Box, Button } from '@material-ui/core';
import RefreshIcon from '@material-ui/icons/Refresh';
import SendIcon from '@material-ui/icons/Send';
import { SearchBar } from './search-bar';

export type SchemaLoaded = {
  schema: Schema;
  keymap: Promise<UniversalKeymap>;
};

type KeymapperProps = {
  ides: Ide[];
  keymap: UniversalKeymap;
};

type KeymapperState = {
  keymap: UniversalKeymap;
  schemas: SchemaLoaded[];
  filteredShortcutCategories: ShortcutCategories;
  openedCategories: boolean[];
  setOpenedCategories: ((value: boolean) => void)[];
  shortcutDialogDefinition?: IShortcutDefinition;
};

export class Keymapper extends Component<KeymapperProps, KeymapperState> {
  private shortcutCategories: Promise<ShortcutCategories>;

  constructor(props: KeymapperProps) {
    super(props);

    const schemas: SchemaLoaded[] = [
      {
        schema: {
          fileName: 'user',
          label: 'Custom',
        },
        keymap: Promise.resolve(this.props.keymap),
      },
    ];
    schemas.push(...this.loadSchemas());

    this.shortcutCategories = ShortcutCategories.read();

    this.state = {
      keymap: this.props.keymap,
      schemas: schemas,
      filteredShortcutCategories: new ShortcutCategories(),
      openedCategories: [],
      setOpenedCategories: [],
    };
  }

  // Before the component mounts, we initialise our state
  componentWillMount(): void {
    this.shortcutCategories.then(this.setCategories.bind(this));
  }

  render(): ReactElement {
    return (
      <Box className="keymapper">
        <Box className="header">
          <SchemaSelector
            schemas={this.state.schemas}
            onChange={(schema: SchemaLoaded) => {
              this.onSchemaChange(schema);
            }}
          ></SchemaSelector>
          <SearchBar
            categories={this.shortcutCategories}
            onSearch={this.setCategories.bind(this)}
          ></SearchBar>
        </Box>
        <Box className="content">
          <KeymapTable
            keymap={this.state.keymap}
            shortcutCategories={this.state.filteredShortcutCategories}
            onClick={this.onClickShortcut.bind(this)}
            openedCategories={this.state.openedCategories}
            setOpen={this.state.setOpenedCategories}
          ></KeymapTable>
        </Box>
        <Box className="footer">
          <Box className="bottom-bar">
            <Button
              variant="outlined"
              color="primary"
              startIcon={<RefreshIcon />}
              onClick={this.onRescan.bind(this)}
            >
              Rescan
            </Button>
            <Button
              className="apply-button"
              variant="contained"
              color="primary"
              endIcon={<SendIcon />}
              onClick={this.onApply.bind(this)}
            >
              Apply
            </Button>
          </Box>
        </Box>
        <ShortcutsDialog
          keymap={this.state.keymap}
          shortcutDefinitions={this.state.shortcutDialogDefinition}
          onChange={this.onShortcutChange.bind(this)}
          onCancel={this.onShortcutCancel.bind(this)}
        ></ShortcutsDialog>
      </Box>
    );
  }

  private setCategories(newCategories: ShortcutCategories): void {
    const openedCategories = Array(newCategories.categories.length).fill(true);
    const setOpenedCategories = openedCategories.map<(value: boolean) => void>(
      (_value, idx) => {
        return (value: boolean) => {
          const newArr = [...this.state.openedCategories];
          newArr[idx] = value;
          this.setState({
            ...this.state,
            openedCategories: newArr,
          });
        };
      }
    );

    this.setState({
      ...this.state,
      filteredShortcutCategories: newCategories,
      openedCategories,
      setOpenedCategories,
    });
  }

  private loadSchemas(): SchemaLoaded[] {
    return SchemaTypes.SCHEMAS.map((schema) => ({
      schema,
      keymap: LoadSchema(schema),
    }));
  }

  private onSchemaChange(schema: SchemaLoaded): void {
    schema.keymap.then((keymap) => {
      this.setState({ ...this.state, keymap: keymap });
    });
  }

  private onClickShortcut(definition: IShortcutDefinition) {
    this.setState({
      ...this.state,
      shortcutDialogDefinition: definition,
    });
  }

  private onShortcutChange(newKeymap: UniversalKeymap) {
    this.setState({
      ...this.state,
      shortcutDialogDefinition: undefined,
      keymap: newKeymap,
    });
  }

  private onShortcutCancel() {
    this.setState({
      ...this.state,
      shortcutDialogDefinition: undefined,
    });
  }

  private onRescan() {
    throw new Error('not implemented');
  }

  private onApply() {
    this.props.ides.forEach((ide) => {
      ide.converter.save(this.state.keymap);
    });
  }
}
