import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SignInPage, SignUpPage, AboutPage, ContactPage } from "./routes";
import { PublicLayout } from "./layouts/public-layout";
import { HomePage } from "./routes/home-page"; // adjust path as needed
import ProtectedRoute from "./layouts/protected-route";
import MainLayout from "./layouts/main-layout";
import { Generate } from "./views/generate";
import { Dashboard } from "./routes/dashboard";
import { CreateEditPage } from './create-edit-page';
import { MockLoadPage } from "./routes/mock-load-page";
import { MockInterviewPage } from "./routes/mock-interview-page";
import { Feedback } from "./routes/feedback";


export default function App() {
  return (
    <Router>
      <Routes>
        {/* public routes */}
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/sign-in/sso-callback" element={<SignInPage />} />

        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>

        {/* protected routes */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          {/* <Route path="/dashboard" element={<Dashboard />} /> */}
          <Route element={<Generate />} path="/generate">
            <Route index element={<Dashboard />} />
            {/* <Route path="create" element={<CreateEditPage />} /> */}
            <Route path=":interviewId" element={<CreateEditPage />} />
            <Route path=":interview/:interviewId" element={<MockLoadPage/>} />
            <Route path=":interview/:interviewId/start" element={<MockInterviewPage/>} />
            <Route path="feedback/:interviewId" element={<Feedback/>} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}
