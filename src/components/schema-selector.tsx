import Select from '@material-ui/core/Select';
import React, { ReactElement } from 'react';
import { Box, FormControl, InputLabel, MenuItem } from '@material-ui/core';
import { Schema } from '../Connectors/Schema/Schema';

type SchemaSelectorProps = {
  value: number;
  schemas: Schema[];
  onChange: (schemaIdx: number) => void;
};

export const SchemaSelector = (props: SchemaSelectorProps): ReactElement => {
  function handleChange(
    event: React.ChangeEvent<{
      name?: string | undefined;
      value: unknown;
    }>
  ) {
    const idx = parseInt(event.target.value as string);
    props.onChange(idx);
  }

  return (
    <Box className="schema-selector">
      <FormControl variant="outlined" size="small">
        <InputLabel>Schema</InputLabel>
        <Select value={props.value} onChange={handleChange} labelWidth={60}>
          {props.schemas.map((schema, idx) => (
            <MenuItem value={idx} key={idx}>
              {schema.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};
