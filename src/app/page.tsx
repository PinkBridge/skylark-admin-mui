'use client';

import { Button, Divider } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import Icon from '@mui/material/Icon';


export default function Home() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Button variant="contained" color="primary">
        Hello world
      </Button>
      <Icon>account_box</Icon>
      <Divider>{"This div's text looks like that of a button."}</Divider>
    </ThemeProvider>
  );
}
