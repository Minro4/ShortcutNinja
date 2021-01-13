import Select from '@material-ui/core/Select';
import React, { ReactElement } from 'react';
import { Box, FormControl, FormLabel, MenuItem } from '@material-ui/core';
import { Schema } from '../Connectors/Schema/Schema';

type SchemaSelectorProps = {
  schemas: Schema[];
  onChange: (schema: Schema) => void;
};

export const SchemaSelector = (props: SchemaSelectorProps): ReactElement => {
  const [schema, setSchema] = React.useState(0);

  function handleChange(
    event: React.ChangeEvent<{
      name?: string | undefined;
      value: unknown;
    }>
  ) {
    const idx = parseInt(event.target.value as string)
    setSchema(idx);
    if (schema) props.onChange(props.schemas[idx]);
  }

  return (
    <FormControl className="schema-selector">
      <Box>
        <FormLabel>Schema: </FormLabel>
        <Select value={schema} onChange={handleChange}>
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
