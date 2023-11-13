import { create } from 'zustand';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import asDate from './utils/asDate';

type Period = [Date | null, Date | null];

interface Reservation {
  startDate: Date | null; // `persist` may save this as string
  endDate: Date | null; // `persist` may save this as string
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  notes?: string;
}

type CachedReservation = Reservation & {
  startDate: Date | string | null; // `persist` may save this as string
  endDate: Date | string | null; // `persist` may save this as string
};

interface State {
  reservations: CachedReservation[];
}

type Actions = {
  addPeriod: (period: Period) => void;
  editLastPeriod: (period: Period) => number;
  getReservation: (index: number) => Reservation | undefined;
  editReservation: (index: number, reversation: Partial<Reservation>) => void;
  deleteReservation: (index: number) => void;
  getPeriods: () => Period[];
  editPeriods: (periods: Period[]) => void;
};

/* eslint-disable no-param-reassign -- Incompatible with Immer */
const useBookingsStore = create<State & Actions>()(
  devtools(
    immer(
      subscribeWithSelector(
        persist(
          (set, get) => ({
            reservations: [],

            addPeriod: ([startDate, endDate]) => {
              set((state) => {
                state.reservations.push({ startDate, endDate });
              });
            },

            editLastPeriod: ([startDate, endDate]) => {
              set((state) => {
                const lastIndex = state.reservations.length - 1;
                state.reservations[lastIndex] = {
                  ...state.reservations[lastIndex],
                  startDate,
                  endDate,
                };
              });
              const { reservations } = get();
              return reservations.length - 1;
            },

            getReservation: (index) => {
              const { reservations } = get();
              if (!reservations[index]) return undefined;

              const { startDate, endDate, ...reservation } =
                reservations[index];

              return {
                ...reservation,
                startDate: asDate(startDate),
                endDate: asDate(endDate),
              };
            },

            editReservation: (index, reservation) => {
              set((state) => {
                state.reservations[index] = {
                  ...state.reservations[index],
                  ...reservation,
                };
              });
            },

            deleteReservation: (index) => {
              set((state) => {
                state.reservations.splice(index, 1);
              });
            },

            getPeriods: () => {
              const { reservations } = get();
              return reservations.map(({ startDate, endDate }) => [
                asDate(startDate),
                asDate(endDate),
              ]);
            },

            editPeriods: (periods) => {
              set((state) => {
                periods.forEach(([startDate, endDate], index) => {
                  state.reservations[index] = {
                    ...state.reservations[index],
                    startDate,
                    endDate,
                  };
                });
              });
            },
          }),

          { name: 'bookings-storage' }
        )
      )
    )
  )
);

export default useBookingsStore;
