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
import { ShortcutsDialog } from './shortcuts-dialog';
import { Box } from '@material-ui/core';
import { Footer } from './footer';
import Store from 'electron-store';
import { IJsonUniversalKeymap } from '../Connectors/Keymap/UniversalKeymap';
import { WelcomeDialog } from './welcome-dialog';
import { LoadingBackdrop } from './loading-backdrop';
import { TopBar } from './top-bar';

type KeymapperProps = {
  ides: Ide[];
};

type KeymapperState = {
  keymap: UniversalKeymap;
  filteredShortcutCategories: ShortcutCategories;
  openedCategories: boolean[];
  setOpenedCategories: ((value: boolean) => void)[];
  shortcutDialogDefinition?: IShortcutDefinition;
  welcomeDialogOpened: boolean;
  isLoading: boolean;
  schemaSelectorValue: number;
};

export class Keymapper extends Component<KeymapperProps, KeymapperState> {
  private store: Store;
  private uniKmStoreKey = 'universal-keymap';
  private schemas: Schema[];

  constructor(props: KeymapperProps) {
    super(props);

    this.store = new Store();

    const fetchedKeymap = this.fetchKeymap();
    const keymap = fetchedKeymap ?? new UniversalKeymap();

    const categories = ShortcutCategories.baseCategories;

    this.schemas = [new Schema('Custom', keymap)].concat(SchemaTypes.SCHEMAS);

    this.state = {
      keymap,
      filteredShortcutCategories: categories,
      openedCategories: Array(categories.categories.length).fill(true),
      setOpenedCategories: this.createSetOpenedCategories(categories),
      welcomeDialogOpened: !fetchedKeymap,
      isLoading: false,
      schemaSelectorValue: 0,
    };
  }

  render(): ReactElement {
    return (
      <Box className="keymapper">
        <TopBar
          schemaSelectorValue={this.state.schemaSelectorValue}
          schemas={this.schemas}
          onSchemaChange={this.onSchemaChange.bind(this)}
          onSearch={this.setCategories.bind(this)}
        ></TopBar>

        <Box className="content">
          <KeymapTable
            keymap={this.state.keymap}
            shortcutCategories={this.state.filteredShortcutCategories}
            onClick={this.onClickShortcut.bind(this)}
            openedCategories={this.state.openedCategories}
            setOpen={this.state.setOpenedCategories}
          ></KeymapTable>
        </Box>

        <Footer
          ides={this.props.ides}
          keymap={this.state.keymap}
          onImport={this.importIde.bind(this)}
        ></Footer>

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
        <LoadingBackdrop open={this.state.isLoading}></LoadingBackdrop>
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

  private onSchemaChange(schemaIdx: number): void {
    this.setState({
      keymap: this.schemas[schemaIdx].get(),
      schemaSelectorValue: schemaIdx,
    });
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

    this.setCustomKeymap(newKeymap);
  }

  private onShortcutCancel() {
    this.setState({
      shortcutDialogDefinition: undefined,
    });
  }

  private importIde(ide: Ide): void {
    this.setState({ isLoading: true });
    ide.converter.load().then((keymap) => {
      this.setState({ isLoading: false });
      this.setCustomKeymap(keymap);
    });
  }

  private setCustomKeymap(newKeymap: UniversalKeymap) {
    this.schemas[0].set(newKeymap);
    this.setState({ keymap: newKeymap, schemaSelectorValue: 0 });
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
