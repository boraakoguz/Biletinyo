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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
