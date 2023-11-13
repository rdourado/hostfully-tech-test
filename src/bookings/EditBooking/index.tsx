import { useCallback } from 'react';
import { Link, useLocation, useRoute } from 'wouter';
import { Button, Grid, Group, Modal, TextInput, Textarea } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import useBookingsStore from '../BookingsView/store';

interface Reservation {
  startDate: Date | null;
  endDate: Date | null;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notes: string;
}

function EditBooking() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute('/edit/:index');
  const [getReservation, editReservation] = useBookingsStore((store) => [
    store.getReservation,
    store.editReservation,
  ]);

  const index = parseInt(params?.index || '0', 10);
  const reservation = getReservation(index);

  const goBack = useCallback(() => setLocation('/'), [setLocation]);

  if (!reservation) goBack();

  const form = useForm<Reservation>({
    initialValues: {
      startDate: reservation?.startDate || null,
      endDate: reservation?.endDate || null,
      firstName: reservation?.firstName || '',
      lastName: reservation?.lastName || '',
      email: reservation?.email || '',
      phone: reservation?.phone || '',
      notes: reservation?.notes || '',
    },

    validate: {
      firstName: (value) =>
        value.length < 2 ? 'First name must have at least 2 letters' : null,
      lastName: (value) =>
        value.length < 2 ? 'Last name must have at least 2 letters' : null,
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    },
  });

  const handleSubmit = useCallback(
    (values: Reservation) => {
      editReservation(index, values);
      notifications.show({
        title: 'Booking',
        message: 'Reservation done. Go pack your bags!',
      });
      goBack();
    },
    [editReservation, goBack, index]
  );

  return (
    <Modal title="Booking" opened centered size="lg" onClose={goBack}>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Grid>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <DateInput
              disabled
              label="Start date"
              {...form.getInputProps('startDate')}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <DateInput
              disabled
              label="End date"
              {...form.getInputProps('endDate')}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6 }}>
            <TextInput
              withAsterisk
              label="First name"
              placeholder="Name"
              {...form.getInputProps('firstName')}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <TextInput
              withAsterisk
              label="Last name"
              placeholder="Surname"
              {...form.getInputProps('lastName')}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6 }}>
            <TextInput
              withAsterisk
              type="email"
              label="Email"
              placeholder="your@email.com"
              {...form.getInputProps('email')}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <TextInput
              type="tel"
              label="Phone"
              placeholder="123-456-7890"
              {...form.getInputProps('phone')}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12 }}>
            <Textarea
              label="Please let us know if you have any special requests."
              placeholder="Notes (optional)"
              rows={4}
              {...form.getInputProps('notes')}
            />
          </Grid.Col>
        </Grid>

        <Group justify="space-between" mt="xl">
          <Link href={`/delete/${params?.index}`}>
            <Button component="a" variant="outline" color="red" radius="xl">
              Delete
            </Button>
          </Link>
          <Button type="submit" radius="xl">
            Save
          </Button>
        </Group>
      </form>
    </Modal>
  );
}

export default EditBooking;
