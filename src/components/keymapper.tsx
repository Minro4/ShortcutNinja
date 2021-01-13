import React, { Component, ReactElement } from 'react'; // let's also import Component
import { Ide } from '../Connectors/Ide';
import { Schema } from '../Connectors/Schema/Schema';
import { SchemaTypes } from '../Connectors/Schema/SchemaTypes';
import {
  IShortcutDefinition,
  ShortcutCategories,
} from '../Connectors/ShortcutDefinitions';
import { UniversalKeymap } from '../Connectors/Keymap';
import { KeymapTable } from './keymap-table';
import { SchemaSelector } from './schema-selector';
import { ShortcutsDialog } from './shortcuts-dialog';
import { Box } from '@material-ui/core';
import { SearchBar } from './search-bar';
import { Footer } from './footer';

type KeymapperProps = {
  ides: Ide[];
};

type KeymapperState = {
  keymap: UniversalKeymap;
  schemas: Schema[];
  filteredShortcutCategories: ShortcutCategories;
  openedCategories: boolean[];
  setOpenedCategories: ((value: boolean) => void)[];
  shortcutDialogDefinition?: IShortcutDefinition;
  importDialogOpened: boolean;
};

export class Keymapper extends Component<KeymapperProps, KeymapperState> {
  constructor(props: KeymapperProps) {
    super(props);

    const km = new UniversalKeymap();

    const categories = ShortcutCategories.baseCategories;

    this.state = {
      keymap: km,
      schemas: SchemaTypes.SCHEMAS,
      filteredShortcutCategories: categories,
      openedCategories: Array(categories.categories.length).fill(true),
      setOpenedCategories: this.createSetOpenedCategories(categories),
      importDialogOpened: false,
    };
  }

  render(): ReactElement {
    return (
      <Box className="keymapper">
        <Box className="header">
          <SchemaSelector
            schemas={this.state.schemas}
            onChange={(schema: Schema) => {
              this.onSchemaChange(schema);
            }}
          ></SchemaSelector>
          <SearchBar onSearch={this.setCategories.bind(this)}></SearchBar>
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
          <Footer
            ides={this.props.ides}
            keymap={this.state.keymap}
            importDialogOpened={this.state.importDialogOpened}
            onImport={this.importIde.bind(this)}
            onOpenImport={() => this.setImportDialogOpen(true)}
            onCloseImport={() => this.setImportDialogOpen(false)}
          ></Footer>
        </Box>
        <ShortcutsDialog
          keymap={this.state.keymap}
          shortcutDefinition={this.state.shortcutDialogDefinition}
          onChange={this.onShortcutChange.bind(this)}
          onCancel={this.onShortcutCancel.bind(this)}
        ></ShortcutsDialog>
      </Box>
    );
  }

  private setCategories(newCategories: ShortcutCategories): void {
    const openedCategories = Array(newCategories.categories.length).fill(true);
    const setOpenedCategories = this.createSetOpenedCategories(newCategories);

    this.setState({
      ...this.state,
      filteredShortcutCategories: newCategories,
      openedCategories,
      setOpenedCategories,
    });
  }

  private createSetOpenedCategories(categories: ShortcutCategories) {
    return categories.categories.map<(value: boolean) => void>((_value, idx) => {
      return (value: boolean) => {
        const newArr = [...this.state.openedCategories];
        newArr[idx] = value;
        this.setState({
          ...this.state,
          openedCategories: newArr,
        });
      };
    });
  }

  private onSchemaChange(schema: Schema): void {
    this.setState({ ...this.state, keymap: schema.get() });
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

  private importIde(ide: Ide): void {
    ide.converter.load().then((keymap) => {
      this.setState({ ...this.state, keymap: keymap });
    });

    this.setImportDialogOpen(false);
  }

  private setImportDialogOpen(value: boolean) {
    this.setState({ ...this.state, importDialogOpened: value });
  }
}
