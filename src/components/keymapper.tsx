import React, { Component, ReactElement } from 'react'; // let's also import Component
import { Ide } from '../Connectors/Ide';
import { Schema, SchemaTypes } from '../Connectors/Schema/Schema';
import { LoadSchema } from '../Connectors/Schema/SchemaLoader';
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

export type SchemaLoaded = {
  schema: Schema;
  keymap: Promise<UniversalKeymap>;
};

type KeymapperProps = {
  ides: Ide[];
};

type KeymapperState = {
  keymap: UniversalKeymap;
  schemas: SchemaLoaded[];
  filteredShortcutCategories: ShortcutCategories;
  shortcutCategories: ShortcutCategories;
  openedCategories: boolean[];
  setOpenedCategories: ((value: boolean) => void)[];
  shortcutDialogDefinition?: IShortcutDefinition;
  importDialogOpened: boolean;
};

export class Keymapper extends Component<KeymapperProps, KeymapperState> {
  private shortcutCategories: Promise<ShortcutCategories>;

  constructor(props: KeymapperProps) {
    super(props);

    const km = new UniversalKeymap()
    const schemas: SchemaLoaded[] = [
      {
        schema: {
          fileName: 'user',
          label: 'Custom',
        },
        keymap: Promise.resolve(km),
      },
    ];
    schemas.push(...this.loadSchemas());

    this.shortcutCategories = ShortcutCategories.read();

    this.state = {
      keymap: km,
      schemas: schemas,
      filteredShortcutCategories: new ShortcutCategories(),
      shortcutCategories: new ShortcutCategories(),
      openedCategories: [],
      setOpenedCategories: [],
      importDialogOpened: false,
    };
  }

  // Before the component mounts, we initialise our state
  componentWillMount(): void {
    this.shortcutCategories.then(this.setCategories.bind(this));
    this.shortcutCategories.then((shortcutCategories) => {
      this.setState({ ...this.state, shortcutCategories });
    });
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
          <Footer ides={this.props.ides} keymap={this.state.keymap}
          importDialogOpened={this.state.importDialogOpened} onImport={this.importIde.bind(this)} onOpenImport={()=>this.setImportDialogOpen(true)} onCloseImport={()=>this.setImportDialogOpen(false)}></Footer>
        </Box>
        <ShortcutsDialog
          keymap={this.state.keymap}
          shortcutDefinition={this.state.shortcutDialogDefinition}
          shortcutCategories={this.state.shortcutCategories}
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
