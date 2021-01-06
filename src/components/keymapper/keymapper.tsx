import React, { Component, ReactElement } from 'react'; // let's also import Component
import { Ide } from '../../Connectors/Ide';
import { Schema, SchemaTypes } from '../../Connectors/Schema/Schema';
import { LoadSchema } from '../../Connectors/Schema/SchemaLoader';
import {
  IShortcutDefinition,
  ShortcutDefinitions,
} from '../../Connectors/ShortcutDefinitions';
import { UniversalKeymap } from '../../Connectors/Keymap';
import { KeymapTable } from './keymap-table';
import { SchemaSelector } from './schema-selector';
import { ShortcutsDialog } from './shortcuts-dialog';
import { Box, Button } from '@material-ui/core';

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
  shortcutDefinitions: ShortcutDefinitions;
  shortcutDialogDefinition?: IShortcutDefinition;
};

export class Keymapper extends Component<KeymapperProps, KeymapperState> {
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

    this.state = {
      keymap: this.props.keymap,
      schemas: schemas,
      shortcutDefinitions: new ShortcutDefinitions(),
    };
  }

  // Before the component mounts, we initialise our state
  componentWillMount(): void {
    ShortcutDefinitions.read().then((definition) => {
      this.setState({
        ...this.state,
        shortcutDefinitions: definition,
      });
    });
  }

  render(): ReactElement {
    return (
      <Box>
        <SchemaSelector
          schemas={this.state.schemas}
          onChange={(schema: SchemaLoaded) => {
            this.onSchemaChange(schema);
          }}
        ></SchemaSelector>
        <KeymapTable
          keymap={this.state.keymap}
          shortcutDefinitions={this.state.shortcutDefinitions}
          onClick={this.onClickShortcut.bind(this)}
        ></KeymapTable>
        <Button onClick={this.onRescan.bind(this)}>Rescan</Button>
        <Button onClick={this.onApply.bind(this)}>Apply</Button>
        <ShortcutsDialog
          keymap={this.state.keymap}
          shortcutDefinitions={this.state.shortcutDialogDefinition}
          onChange={this.onShortcutChange.bind(this)}
          onCancel={this.onShortcutCancel.bind(this)}
        ></ShortcutsDialog>
      </Box>
    );
  }

  private loadSchemas(): SchemaLoaded[] {
    return SchemaTypes.SCHEMAS.map((schema) => ({
      schema,
      keymap: LoadSchema(schema),
    }));
  }

  private onSchemaChange(schema: SchemaLoaded): void {
    console.log(schema.schema.label);
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
