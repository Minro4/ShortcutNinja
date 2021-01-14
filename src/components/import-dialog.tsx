import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  DialogActions,
} from '@material-ui/core';
import React, { ReactElement } from 'react';
import { Ide } from '../Connectors/Ide';
import { ImportSelector } from './import-selector';

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

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle id="form-dialog-title">Import shortcuts from...</DialogTitle>
      <DialogContent>
        <ImportSelector
          ides={ides}
          value={value}
          setValue={setValue}
        ></ImportSelector>{' '}
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
