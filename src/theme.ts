import { Dialog } from '@material-ui/core';
import { blue } from '@material-ui/core/colors';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import { withStyles } from '@material-ui/styles';

export const themeDark = createMuiTheme({
  palette: {
    primary: blue,
    type: 'dark',
  },
  overrides: {
    MuiDialog: {
      root: {
        "> div": {
          "background-color": '#000000',
        }

      },
    },
  },
});
