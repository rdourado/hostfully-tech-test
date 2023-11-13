import { Calendar } from '@mantine/dates';
import { useLocation } from 'wouter';
import { Card, Stack, Title, useMantineTheme } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import usePeriods from './hooks/usePeriods';

function BookingsView() {
  const [, setLocation] = useLocation();

  const { breakpoints } = useMantineTheme();
  const isSmall = useMediaQuery(`(max-width: ${breakpoints.sm})`);

  const loadPeriod = (index: number) => setLocation(`/edit/${index}`);
  const { getControlProps } = usePeriods({ loadPeriod });

  return (
    <Stack align="center">
      <Title order={1} size={isSmall ? 'h4' : 'h2'}>
        Hello, when are you coming to visit us?
      </Title>
      <Card shadow="sm" radius="lg" withBorder>
        <Calendar
          size="md"
          withCellSpacing={false}
          numberOfColumns={isSmall ? 1 : 2}
          getDayProps={getControlProps}
        />
      </Card>
    </Stack>
  );
}

export default BookingsView;
