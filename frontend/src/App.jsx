import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./LoginPage";
import MainPage from "./MainPage";
import SignInPage from "./SignInPage";
import ProfilePage from "./ProfilePage";
import EventPage from "./EventPage";
import CommentPage from "./CommentPage";
import Seating from "./Seating";

function App() {
  // SOME MIGHT CHANGE
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/event" element={<EventPage />} />
        <Route path="/comment" element={<CommentPage />} />
        <Route path="/seating" element={<Seating />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
