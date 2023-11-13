import { Route } from 'wouter';
import DefaultView from './layout/DefaultView';
import BookingsView from './bookings/BookingsView';
import EditBooking from './bookings/EditBooking';
import DeleteBooking from './bookings/DeleteBooking';

function App() {
  return (
    <DefaultView>
      <BookingsView />
      <Route path="/edit/:index" component={EditBooking} />
      <Route path="/delete/:index" component={DeleteBooking} />
    </DefaultView>
  );
}

export default App;
