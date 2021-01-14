import { FormControlLabel, RadioGroup, Radio } from '@material-ui/core';
import React, { ReactElement } from 'react';
import { Ide } from '../Connectors/Ide';

type ImportSelectorProps = {
  ides: Ide[];
  value: number;
  setValue: (idx: number) => void;
};

export const ImportSelector = ({
  ides,
  setValue,
  value,
}: ImportSelectorProps): ReactElement => {
  if (ides.length === 0) return <></>;
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(parseInt(event.target.value));
  };

  return (
    <RadioGroup name="import ide" value={value} onChange={handleChange}>
      {ides.map((ide, idx) => (
        <FormControlLabel
          value={idx}
          key={idx}
          control={<Radio color="primary" />}
          label={ide.name}
        />
      ))}
    </RadioGroup>
  );
};
