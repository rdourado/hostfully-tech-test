import { useCallback, useMemo } from 'react';
import dayjs from 'dayjs';
import { useLocation, useRoute } from 'wouter';
import { Button, Group, Modal, Stack, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import useBookingsStore from '../BookingsView/store';

function DeleteBooking() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute('/delete/:index');
  const [getReservation, deleteReservation] = useBookingsStore((store) => [
    store.getReservation,
    store.deleteReservation,
  ]);

  const index = parseInt(params?.index || '0', 10);
  const reservation = getReservation(index);

  const goBack = useCallback(() => setLocation('/'), [setLocation]);

  if (!reservation) goBack();

  const handleDelete = useCallback(() => {
    deleteReservation(index);
    notifications.show({
      title: 'Booking',
      message: 'Reservation cancelled. Hope to see you next time!',
    });
    goBack();
  }, [deleteReservation, goBack, index]);

  const [startDate, endDate] = useMemo(
    () => [
      dayjs(reservation?.startDate).format('MMMM D, YYYY'),
      dayjs(reservation?.endDate).format('MMMM D, YYYY'),
    ],
    [reservation]
  );

  return (
    <Modal title="Are you sure?" opened centered size="md" onClose={goBack}>
      <Stack gap="sm">
        <Text component="p">
          You are about to delete your reservation from
          <br />
          <Text component="strong" fw={700}>
            {startDate}
          </Text>{' '}
          to{' '}
          <Text component="strong" fw={700}>
            {endDate}
          </Text>
          .<br />
          This action cannot be undone.
        </Text>

        <Group justify="space-between" mt="xl">
          <Button variant="outline" radius="xl" onClick={goBack}>
            Cancel
          </Button>
          <Button color="red" radius="xl" onClick={handleDelete}>
            Delete
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}

export default DeleteBooking;
