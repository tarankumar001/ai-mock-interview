import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SignInPage, SignUpPage } from "./routes";
import { PublicLayout } from "./layouts/public-layout";
import { HomePage } from "./routes/home-page"; // adjust path as needed

export default function App() {
  return (
    <Router>
      <Routes>
        {/* public routes */}
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />

        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
        </Route>

        {/* protected routes */}
      </Routes>
    </Router>
  );
}
