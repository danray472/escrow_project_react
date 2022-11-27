import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Profile from "./pages/admin/Profile";
import Register from "./pages/authentication/Register";
import VerifyEmail from "./pages/authentication/VerifyEmail";
import Login from "./pages/authentication/Login";
import { AuthProvider } from "./assets/firebase/AuthContext";
import { auth } from "./assets/firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import PrivateRoute from "./assets/route/PrivateRoute";
import { Navigate } from "react-router-dom";
import Home from "./pages/common/Home";
import PageNotFound from "./pages/common/PageNotFound";
import Dashboard from "./pages/admin/Dashboard";
import Payment from "./pages/admin/Payment";
import Tasks from "./pages/admin/Tasks";
import Writers from "./pages/admin/Writers";
import OtherDetails from "./pages/authentication/OtherDetails";
import Reports from "./pages/admin/Reports";

function App() {
  // User state
  const [currentUser, setCurrentUser] = useState(null);
  const [timeActive, setTimeActive] = useState(false);

  // Check if the user is logged in
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
  }, [currentUser]);

  return (
    <Router>
      <AuthProvider value={{ currentUser, timeActive, setTimeActive }}>
        <Routes>
          {/* Default pages */}
          <Route path="*" element={<PageNotFound />} />
          <Route
            path="/"
            element={
              !currentUser?.emailVerified ? (
                <Login />
              ) : (
                <Navigate to={`/${currentUser.uid}/dashboard`} replace />
              )
            }
          />

          <Route
            path="/login"
            element={
              !currentUser?.emailVerified ? (
                <Login />
              ) : (
                <Navigate to={`/${currentUser.uid}/dashboard`} replace />
              )
            }
          />
          <Route
            path="/register"
            element={
              !currentUser?.emailVerified ? (
                <Register />
              ) : (
                <Navigate to={`/${currentUser.uid}/dashboard`} replace />
              )
            }
          />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/:uid/update-details" element={<OtherDetails />} />

          {/* Admin pages */}
          <Route
            exact
            path={`/:uid/dashboard`}
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            exact
            path={`/:uid/payments`}
            element={
              <PrivateRoute>
                <Payment />
              </PrivateRoute>
            }
          />
          <Route
            exact
            path={`/:uid/tasks`}
            element={
              <PrivateRoute>
                <Tasks />
              </PrivateRoute>
            }
          />
          <Route
            exact
            path={`/:uid/writers`}
            element={
              <PrivateRoute>
                <Writers />
              </PrivateRoute>
            }
          />
          <Route
            exact
            path={`/:uid/profile`}
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          /><Route
          exact
          path={`/:uid/reports`}
          element={
            <PrivateRoute>
              <Reports />
            </PrivateRoute>
          }
        />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
