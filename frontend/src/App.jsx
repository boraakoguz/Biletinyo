import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./LoginPage";
import MainPage from "./MainPage";
import SignInPage from "./SignInPage";
import ProfilePage from "./ProfilePage";
import EventPage from "./EventPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/event" element={<EventPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
