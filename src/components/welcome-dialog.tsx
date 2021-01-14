import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  DialogActions,
  Typography,
} from '@material-ui/core';
import React, { ReactElement } from 'react';
import { Ide } from '../Connectors/Ide';
import { ImportSelector } from './import-selector';

type WelcomeDialogProps = {
  ides: Ide[];
  open: boolean;
  onImport: (ide: Ide) => void;
  onClose: () => void;
};

export const WelcomeDialog = ({
  ides,
  open,
  onImport,
  onClose,
}: WelcomeDialogProps): ReactElement => {
  if (ides.length === 0) return <></>;

  const [value, setValue] = React.useState(0);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle id="form-dialog-title">
        <Typography variant="h4" component="h2">
          Welcome to Shortcut Director!
        </Typography>
        <Typography color="textSecondary" className="welcome-secondary-text">
         This is the place to manage all of your IDEs shortcuts.
        </Typography>
        <Typography color="textSecondary" className="welcome-secondary-text">
          We have detected the following IDEs installed on you machine. <br />
          You can import your shortcut settings from any of them!
        </Typography>
      </DialogTitle>
      <DialogContent>
        <ImportSelector
          ides={ides}
          value={value}
          setValue={setValue}
        ></ImportSelector>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => onImport(ides[value])}
          variant="contained"
          color="primary"
        >
          Import
        </Button>
        <Button onClick={onClose} variant="outlined" color="primary">
          Skip
        </Button>
      </DialogActions>
    </Dialog>
  );
};
