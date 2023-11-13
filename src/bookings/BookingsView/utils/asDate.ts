function asDate(date: Date | string | null): Date | null {
  return typeof date === 'string' ? new Date(date) : date;
}

export default asDate;
