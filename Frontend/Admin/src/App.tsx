import { useState } from "react";

import "./App.css";

import {
  clearAdminToken,
  isAdminAuthenticated,
} from "./api/adminApi";
import AnalysisList from "./pages/AnalysisList";
import LoginPage from "./pages/LoginPage";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => isAdminAuthenticated()
  );

  function handleLoginSuccess() {
    setIsAuthenticated(true);
  }

  if (!isAuthenticated) {
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  function handleLogout() {
    clearAdminToken();
    setIsAuthenticated(false);
  }

  return (
    <AnalysisList
      onLogout={handleLogout}
    />
  );
}
