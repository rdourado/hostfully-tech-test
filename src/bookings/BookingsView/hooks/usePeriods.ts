import { useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { DayProps as MantineDayProps } from '@mantine/dates';
import { notifications } from '@mantine/notifications';
import createPeriod from './utils/createPeriod';
import useBookingsStore from '../store';

dayjs.extend(isBetween);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

type Period = [Date | null, Date | null];
type DayProps = Omit<MantineDayProps, 'classNames' | 'styles' | 'vars'>;

interface Props {
  loadPeriod: (index: number, period: Period) => void;
}

function usePeriods(callbacks?: Props) {
  const [pickedDate, setPickedDate] = useState<Dayjs | null>(null);
  const [getPeriods, addPeriod, editLastPeriod] = useBookingsStore((store) => [
    store.getPeriods,
    store.addPeriod,
    store.editLastPeriod,
  ]);

  const periods = getPeriods();

  const getControlProps = (_calendarDate: Date): Partial<DayProps> => {
    const calendarDate = dayjs(_calendarDate);

    let isFirst: boolean = false;
    let isLast: boolean = false;
    let isInPeriod: boolean = false;
    let isSelected: boolean = false;
    let isOverlapping: boolean = false;
    let periodIndex: number | null = null;
    const isDisabled = calendarDate.isSameOrBefore(undefined, 'd');

    periods.forEach((period, index) => {
      const [periodStart, periodEnd] = period.map((d) => d && dayjs(d));

      if (!isFirst) isFirst = calendarDate.isSame(periodStart, 'd');
      if (!isLast) isLast = calendarDate.isSame(periodEnd, 'd');

      if (!isInPeriod && periodEnd) {
        periodIndex = calendarDate.isBetween(periodStart, periodEnd, 'd', '[]')
          ? index
          : null;
        isInPeriod = periodIndex !== null;
        isOverlapping = isInPeriod;
      }

      if (!isSelected) {
        isSelected =
          calendarDate.isSame(periodStart, 'd') ||
          calendarDate.isSame(periodEnd, 'd');
      }

      if (!isOverlapping && periodStart && periodEnd) {
        const [startDate, endDate] = createPeriod(calendarDate, pickedDate);
        isOverlapping =
          periodStart.isSameOrBefore(endDate) &&
          periodEnd.isSameOrAfter(startDate);
      }
    });

    const onClick = () => {
      const loadPeriod = callbacks?.loadPeriod || (() => {});

      if (isOverlapping) {
        if (!pickedDate && typeof periodIndex === 'number') {
          loadPeriod(periodIndex, periods[periodIndex]);
        } else {
          notifications.show({
            title: 'Hey!',
            message: 'That period is not available.',
            color: 'yellow',
          });
        }
        return;
      }

      if (!pickedDate) {
        const period = createPeriod(calendarDate.toDate(), null);
        addPeriod(period);
        setPickedDate(calendarDate);
      } else {
        const period = createPeriod(calendarDate.toDate(), pickedDate.toDate());
        const index = editLastPeriod(period);
        setPickedDate(null);
        loadPeriod(index, period);
      }
    };

    return {
      selected: isSelected,
      inRange: isInPeriod,
      firstInRange: isFirst,
      lastInRange: isLast,
      disabled: isDisabled,
      onClick,
    };
  };

  return { getControlProps };
}

export default usePeriods;
