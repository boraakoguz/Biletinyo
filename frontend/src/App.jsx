import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./LoginPage";
import MainPage from "./MainPage";
import SignInPage from "./SignInPage";
import ProfilePage from "./ProfilePage";
import EventPage from "./EventPage";
import CommentPage from "./CommentPage";
import GuestPage from "./GuestPage";
import Seating from "./Seating";
import TicketPage from "./TicketPage";
import PaymentPage from "./PaymentPage";
import CreateEvent from "./Organizer/CreateEvent";
import OrganizerDashboard from "./Organizer/OrganizerDashboard";
import ManageEvents from "./Organizer/ManageEvents";
import TicketCategoryEdit from "./Organizer/TicketCategoryEdit";
import VenueManagement from "./Organizer/VenueManagement";
import AddVenue from "./Organizer/AddVenue";
import SeatingConfig     from "./Organizer/SeatingConfig";
import SalesAnalytics from "./Organizer/SalesAnalytics";

function App() {
  // SOME MIGHT CHANGE
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/event/:id" element={<EventPage />} />
        <Route path="/event/:id/comments" element={<CommentPage />} />
        <Route path="/event/:id/seating" element={<Seating />} />
        <Route path="/guest" element={<GuestPage />} />
        <Route path="/ticket/:id" element={<TicketPage />} />
        <Route path="/seating" element={<Seating />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/create" element={<CreateEvent />} />
        <Route path="/organizer/dashboard" element={<OrganizerDashboard />} />
        //<Route path="/organizer/events" element={<ManageEvents />} />
        <Route path="/organizer/events/:id" element={<ManageEvents />} />
        <Route path="/organizer/events/new" element={<CreateEvent />} />
        <Route path="/organizer/events/:id/categories" element={<TicketCategoryEdit />} />
        <Route path="/organizer/venues" element={<VenueManagement />} />
        <Route path="/organizer/venues/new" element={<AddVenue />} />
        <Route path="/organizer/venues/:id/seating" element={<SeatingConfig />} />
        <Route path="/organizer/reports/sales" element={<SalesAnalytics />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
