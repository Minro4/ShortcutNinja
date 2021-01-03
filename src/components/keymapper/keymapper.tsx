import React, { Component, ReactElement } from 'react'; // let's also import Component
import { Ide } from '../../Connectors/Ide';
import { Schema, SchemaTypes } from '../../Connectors/Schema/Schema';
import { LoadSchema } from '../../Connectors/Schema/SchemaLoader';
import { ShortcutDefinitions } from '../../Connectors/ShortcutDefinitions';
import { UniversalKeymap } from '../../Connectors/Keymap';
import { KeymapTable } from './keymap-table';
import { SchemaSelector } from './schema-selector';

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
};

export class Keymapper extends Component<KeymapperProps, KeymapperState> {
  constructor(props: KeymapperProps) {
    super(props);

    const schemas: SchemaLoaded[] = [{
      schema: {
        fileName:"user",
        label:"Custom"
      },
      keymap: Promise.resolve(this.props.keymap)
    }]
    schemas.push(...this.loadSchemas())

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
      <div>
        <SchemaSelector schemas ={this.state.schemas} onChange={this.onSchemaChange}></SchemaSelector>
        <KeymapTable
          keymap={this.state.keymap}
          shortcutDefinitions={this.state.shortcutDefinitions}
        ></KeymapTable>
      </div>
    );
  }

  private loadSchemas(): SchemaLoaded[] {
    return SchemaTypes.SCHEMAS.map((schema) => ({
      schema,
      keymap: LoadSchema(schema),
    }));
  }

  private onSchemaChange(schema:SchemaLoaded):void {
    console.log(schema.schema.label)
  }
}
