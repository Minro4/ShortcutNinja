import Select from '@material-ui/core/Select';
import React, { ReactElement } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  InputLabel,
  MenuItem,
} from '@material-ui/core';
import { SchemaLoaded } from './keymapper';

type SchemaSelectorProps = {
  schemas: SchemaLoaded[];
  onChange: (schema: SchemaLoaded) => void;
};

export const SchemaSelector = (props: SchemaSelectorProps): ReactElement => {
  const [schema, setSchema] = React.useState(props.schemas[0].schema.fileName);

  function handleChange(
    event: React.ChangeEvent<{
      name?: string | undefined;
      value: unknown;
    }>
  ) {
    setSchema(event.target.value as string);
    const schema = props.schemas.find(
      (schema) => schema.schema.fileName === event.target.value
    );

    if (schema) props.onChange(schema);
  }

  return (
    <FormControl className="schema-selector">
      <Box>
        <FormLabel>Schema: </FormLabel>
        <Select value={schema} onChange={handleChange}>
          {props.schemas.map((schema, idx) => (
            <MenuItem value={schema.schema.fileName} key={idx}>
              {schema.schema.label}
            </MenuItem>
          ))}
        </Select>
      </Box>
    </FormControl>
  );
};
