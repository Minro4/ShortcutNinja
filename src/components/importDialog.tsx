import {
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  DialogActions,
  RadioGroup,
  Radio,
} from '@material-ui/core';
import React, { ReactElement } from 'react';
import { Ide } from '../Connectors/Ide';

type ImportDialogProps = {
  ides: Ide[];
  open: boolean;
  onSelect: (ide: Ide) => void;
  onClose: () => void;
};

export const ImportDialog = ({
  ides,
  open,
  onSelect,
  onClose,
}: ImportDialogProps): ReactElement => {
  if (ides.length === 0) return <></>;

  const [value, setValue] = React.useState(0);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(parseInt(event.target.value));
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle id="form-dialog-title">Import shortcuts from...</DialogTitle>
      <DialogContent>
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
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => onSelect(ides[value])}
          variant="contained"
          color="primary"
        >
          Import
        </Button>
        <Button onClick={onClose} variant="outlined" color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};
