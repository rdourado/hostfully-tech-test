import { Dayjs, isDayjs } from 'dayjs';

function createPeriod(
  dateA: Date | null,
  dateB: Date | null
): [Date | null, Date | null];
function createPeriod(
  dateA: Dayjs | null,
  dateB: Dayjs | null
): [Dayjs | null, Dayjs | null];
function createPeriod(dateA: Date | Dayjs | null, dateB: Date | Dayjs | null) {
  const period: [typeof dateA, typeof dateB] = [dateA, dateB];

  period.sort((a, b) => {
    if (!a) return 1; // null always last
    if (!b) return -1; // null always last
    const dateObjA = isDayjs(a) ? a.toDate() : a;
    const dateObjB = isDayjs(b) ? b.toDate() : b;
    return dateObjA.getTime() - dateObjB.getTime();
  });

  return period;
}

export default createPeriod;
