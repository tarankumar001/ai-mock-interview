import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SignInPage, SignUpPage } from "./routes";
import { PublicLayout } from "./layouts/public-layout";
import { HomePage } from "./routes/home-page"; // adjust path as needed
import ProtectedRoute from "./layouts/protected-route";
import MainLayout from "./layouts/main-layout";
import { Generate } from "./views/generate";
import { Dashboard } from "./routes/dashboard";

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
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route element={<Generate />} path="/generate">
            <Route index element={<Dashboard />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}
