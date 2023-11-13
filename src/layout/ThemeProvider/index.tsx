import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';
import theme from '../../theme';

interface Props {
  children: React.ReactNode;
}

function ThemeProvider({ children }: Props) {
  return (
    <MantineProvider theme={theme}>
      <Notifications position="top-center" />
      <ModalsProvider>{children}</ModalsProvider>
    </MantineProvider>
  );
}

export default ThemeProvider;
