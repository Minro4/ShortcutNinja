import Select from '@material-ui/core/Select';
import React, { ReactElement } from 'react';
import { Box, FormControl, FormLabel, MenuItem } from '@material-ui/core';
import { Schema } from '../Connectors/Schema/Schema';

type SchemaSelectorProps = {
  value: number
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
    <FormControl>
      <Box>
        <FormLabel>Schema: </FormLabel>
        <Select value={props.value} onChange={handleChange} autoWidth>
          {props.schemas.map((schema, idx) => (
            <MenuItem value={idx} key={idx}>
              {schema.label}
            </MenuItem>
          ))}
        </Select>
      </Box>
    </FormControl>
  );
};
