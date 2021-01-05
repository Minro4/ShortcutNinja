import { blue } from '@material-ui/core/colors';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';

export const themeDark = createMuiTheme({
  palette: {
    primary: blue,
    type: 'dark',
  },
});

export const themeLight = createMuiTheme({
  palette: {
    primary: blue,
    type: 'light',
  },
});
