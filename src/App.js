import React, { useEffect, useState } from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Sidebar from "./Sidebar";
import MainImage from "./MainImage";
import AboutImage from "./AboutImage";
import Projects from "./Projects";
import Signin from "./signin";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    // Check if the token exists in session storage
    return !!sessionStorage.getItem("authToken");
  });

  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem("authToken");
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  useEffect(() => {
    const sessionTimeout = 0.5 * 60 * 60 * 1000; // 0.5 hours in milliseconds

    const startSessionTimer = () => {
      setTimeout(() => {
        handleLogout();
      }, sessionTimeout);
    };

    if (isLoggedIn) {
      startSessionTimer();
    }

    const handleUserActivity = () => {
      clearTimeout(startSessionTimer);
      startSessionTimer();
    };

    document.addEventListener("click", handleUserActivity);
    document.addEventListener("keypress", handleUserActivity);
    return () => {
      document.removeEventListener("click", handleUserActivity);
      document.removeEventListener("keypress", handleUserActivity);
    };
  }, [isLoggedIn]);

  const ProtectedRoute = ({ element }) => {
    return isLoggedIn ? element : <Navigate to="/signin" replace />;
  };

  return (
    <Router>
      <div style={{ display: "flex" }}>
        {isLoggedIn && <Sidebar onLogout={handleLogout} />}
        <div style={{ padding: "20px", width: "100%" }}>
          <Routes>
            <Route path="/signin" element={<Signin onLogin={handleLogin} />} />
            <Route
              path="/main-image"
              element={<ProtectedRoute element={<MainImage />} />}
            />
            <Route
              path="/about-image"
              element={<ProtectedRoute element={<AboutImage />} />}
            />
            <Route
              path="/projects"
              element={<ProtectedRoute element={<Projects />} />}
            />
            <Route
              path="/"
              element={
                <Navigate to={isLoggedIn ? "/main-image" : "/signin"} replace />
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
