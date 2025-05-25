import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./LoginPage";
import MainPage from "./MainPage";
import SignInPage from "./SignInPage";
import ProfilePage from "./ProfilePage";
import EventPage from "./EventPage";
import CommentPage from "./CommentPage";
import GuestPage from "./GuestPage";
import Seating from "./Seating";
import PaymentPage from "./PaymentPage";
import CreateEvent from "./Organizer/CreateEvent";
import OrganizerDashboard from "./Organizer/OrganizerDashboard";
import ManageEvents from "./Organizer/ManageEvents";
import TicketCategoryEdit from "./Organizer/TicketCategoryEdit";
import AddVenue from "./Organizer/AddVenue";
import AuthRoute from "./AuthRoute";
import GroupedTicketsPage from "./GroupedTicketsPage";
import OrganizerPage from "./OrganizerPage";
import VenueRequest from "./Organizer/VenueRequest";
import VenueSeatMap from "./Organizer/VenueSeatMap";
import ConfigureSeating from "./Organizer/ConfigureSeating";
import AdminDashboard from "./Admin/AdminDashboard";
import AdminVenueManagement from "./Admin/VenueManagement";
import AdminAddVenue from "./Admin/AdminAddVenue";
import AdminReports from "./Admin/AdminReports";
import AdminPayments from "./Admin/AdminPayments";
import ForgotPassword from "./ForgotPassword";
import AdminVenueSeatMap from "./Admin/AdminVenueSeatMap";
import HomeRedirect from "./HomeRedirect";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/event/:id" element={<EventPage />} />
        <Route path="/event/comment" element={<CommentPage />} />
        <Route path="/organizer/:id" element={<OrganizerPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        {/* Protected Routes - Require Authentication */}
        <Route
          path="/profile"
          element={
            <AuthRoute>
              <ProfilePage />
            </AuthRoute>
          }
        />
        <Route
          path="/event/:id/seating"
          element={
            <AuthRoute>
              <Seating />
            </AuthRoute>
          }
        />
        <Route
          path="/event/:id/guest"
          element={
            <AuthRoute>
              <GuestPage />
            </AuthRoute>
          }
        />
        <Route path="/tickets/group" element={<GroupedTicketsPage />} />
        <Route
          path="/event/:id/payment"
          element={
            <AuthRoute>
              <PaymentPage />
            </AuthRoute>
          }
        />

        {/* Organizer Routes - Require Organizer Role */}

        <Route
          path="/organizer/venues/request"
          element={
            <AuthRoute requireOrganizer={true}>
              <VenueRequest />
            </AuthRoute>
          }
        />
        <Route
          path="/organizer/venues/request/seatmap"
          element={
            <AuthRoute requireOrganizer={true}>
              <VenueSeatMap />
            </AuthRoute>
          }
        />

        <Route
          path="/organizer/create"
          element={
            <AuthRoute requireOrganizer={true}>
              <CreateEvent />
            </AuthRoute>
          }
        />
        <Route
          path="/organizer/dashboard"
          element={
            <AuthRoute requireOrganizer={true}>
              <OrganizerDashboard />
            </AuthRoute>
          }
        />
        <Route
          path="/organizer/events"
          element={
            <AuthRoute requireOrganizer={true}>
              <ManageEvents />
            </AuthRoute>
          }
        />
        <Route
          path="/organizer/events/:id"
          element={
            <AuthRoute requireOrganizer={true}>
              <ManageEvents />
            </AuthRoute>
          }
        />
        <Route
          path="/organizer/events/new"
          element={
            <AuthRoute requireOrganizer={true}>
              <CreateEvent />
            </AuthRoute>
          }
        />
        <Route
          path="/organizer/events/:id/categories"
          element={
            <AuthRoute requireOrganizer={true}>
              <TicketCategoryEdit />
            </AuthRoute>
          }
        />
        <Route
          path="/organizer/events/configure-seating"
          element={
            <AuthRoute requireOrganizer={true}>
              <ConfigureSeating />
            </AuthRoute>
          }
        />
        <Route
          path="/organizer/venues/new"
          element={
            <AuthRoute requireOrganizer={true}>
              <AddVenue />
            </AuthRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <AuthRoute requireAdmin={true}>
              <AdminDashboard />
            </AuthRoute>
          }
        />
        <Route
          path="/admin/venues"
          element={
            <AuthRoute requireAdmin={true}>
              <AdminVenueManagement />
            </AuthRoute>
          }
        />

        <Route
          path="/admin/venues/new"
          element={
            <AuthRoute requireAdmin={true}>
              <AdminAddVenue />
            </AuthRoute>
          }
        />
        <Route
          path="/admin/venues/new/seatmap"
          element={
            <AuthRoute requireAdmin={true}>
              <AdminVenueSeatMap />
            </AuthRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <AuthRoute requireAdmin={true}>
              <AdminReports />
            </AuthRoute>
          }
        />

        <Route
          path="/admin/payments"
          element={
            <AuthRoute requireAdmin={true}>
              <AdminPayments />
            </AuthRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
