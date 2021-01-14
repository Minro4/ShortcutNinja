import { Box } from '@material-ui/core';
import React, { Component, ReactElement } from 'react';
import { SchemaSelector } from './schema-selector';
import { SearchBar } from './search-bar';
import { Schema } from '../Connectors/Schema/Schema';
import { ShortcutCategories } from '../Connectors/ShortcutDefinitions';

type TopBarProps = {
  schemaSelectorValue: number;
  schemas: Schema[];
  onSchemaChange: (schemaIdx: number) => void;
  onSearch: (newCategories: ShortcutCategories) => void;
};

export class TopBar extends Component<TopBarProps> {
  constructor(props: TopBarProps) {
    super(props);
  }

  render(): ReactElement {
    return (
      <Box className="header">
        <SearchBar onSearch={this.props.onSearch}></SearchBar>
        <SchemaSelector
          value={this.props.schemaSelectorValue}
          schemas={this.props.schemas}
          onChange={this.props.onSchemaChange}
        ></SchemaSelector>
      </Box>
    );
  }
}
