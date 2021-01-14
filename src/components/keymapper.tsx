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
import Store from 'electron-store';
import { IJsonUniversalKeymap } from '../Connectors/Keymap/UniversalKeymap';
import { WelcomeDialog } from './welcome-dialog';

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
  welcomeDialogOpened: boolean;
};

export class Keymapper extends Component<KeymapperProps, KeymapperState> {
  private store: Store;
  private uniKmStoreKey = 'universal-keymap';

  constructor(props: KeymapperProps) {
    super(props);

    this.store = new Store();
    this.store.delete(this.uniKmStoreKey)
    const keymap = this.fetchKeymap();
    console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
    console.log(keymap)
    const categories = ShortcutCategories.baseCategories;
    this.state = {
      keymap: keymap ?? new UniversalKeymap(),
      schemas: SchemaTypes.SCHEMAS,
      filteredShortcutCategories: categories,
      openedCategories: Array(categories.categories.length).fill(true),
      setOpenedCategories: this.createSetOpenedCategories(categories),
      welcomeDialogOpened: !keymap,
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
            onImport={this.importIde.bind(this)}
          ></Footer>
        </Box>
        <ShortcutsDialog
          keymap={this.state.keymap}
          shortcutDefinition={this.state.shortcutDialogDefinition}
          onChange={this.onShortcutChange.bind(this)}
          onCancel={this.onShortcutCancel.bind(this)}
        ></ShortcutsDialog>
        <WelcomeDialog
          ides={this.props.ides}
          open={this.state.welcomeDialogOpened}
          onImport={(ide) => {
            this.importIde(ide);
            this.setState({ welcomeDialogOpened: false });
          }}
          onClose={() => this.setState({ welcomeDialogOpened: false })}
        ></WelcomeDialog>
      </Box>
    );
  }

  private setCategories(newCategories: ShortcutCategories): void {
    const openedCategories = Array(newCategories.categories.length).fill(true);
    const setOpenedCategories = this.createSetOpenedCategories(newCategories);

    this.setState({
      filteredShortcutCategories: newCategories,
      openedCategories,
      setOpenedCategories,
    });
  }

  private createSetOpenedCategories(categories: ShortcutCategories) {
    return categories.categories.map<(value: boolean) => void>(
      (_value, idx) => {
        return (value: boolean) => {
          const newArr = [...this.state.openedCategories];
          newArr[idx] = value;
          this.setState({
            openedCategories: newArr,
          });
        };
      }
    );
  }

  private onSchemaChange(schema: Schema): void {
    this.setKeymap(schema.get());
  }

  private onClickShortcut(definition: IShortcutDefinition) {
    this.setState({
      shortcutDialogDefinition: definition,
    });
  }

  private onShortcutChange(newKeymap: UniversalKeymap) {
    this.setState({
      shortcutDialogDefinition: undefined,
    });

    this.setKeymap(newKeymap);
  }

  private onShortcutCancel() {
    this.setState({
      shortcutDialogDefinition: undefined,
    });
  }

  private importIde(ide: Ide): void {
    ide.converter.load().then((keymap) => {
      this.setKeymap(keymap);
    });
  }

  private setKeymap(newKeymap: UniversalKeymap) {
    this.setState({ keymap: newKeymap });
    this.storeKeymap(newKeymap);
  }

  private storeKeymap(keymap: UniversalKeymap) {
    this.store.set(this.uniKmStoreKey, keymap.toJson());
  }

  private fetchKeymap(): UniversalKeymap | undefined {
    const json = this.store.get(this.uniKmStoreKey) as IJsonUniversalKeymap;
    if (json) return UniversalKeymap.fromJson(json);
    return undefined;
  }
}
