import { ReactNode } from 'react';
import { AppShell } from '@mantine/core';
import ThemeProvider from '../ThemeProvider';

interface Props {
  children: ReactNode;
}

function DefaultView({ children }: Props) {
  return (
    <ThemeProvider>
      <AppShell p="xl">
        <AppShell.Main>{children}</AppShell.Main>
      </AppShell>
    </ThemeProvider>
  );
}

export default DefaultView;
