import React, { Component, ReactElement } from 'react'; // let's also import Component
import { Ide } from '../../Connectors/Ide';
import { Schema, SchemaTypes } from '../../Connectors/Schema/Schema';
import { LoadSchema } from '../../Connectors/Schema/SchemaLoader';
import { ShortcutDefinitions } from '../../Connectors/ShortcutDefinitions';
import { UniversalKeymap } from '../../Connectors/UniversalKeymap';
import { KeymapTable } from './keymap-table';

type SchemaLoaded = {
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
    console.log("allo" + this.props.keymap);
    this.state = {
      keymap: this.props.keymap,
      schemas: this.loadSchemas(),
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
}
