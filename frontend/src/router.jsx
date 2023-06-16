import { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import App from "./App";
import Auth from "./pages/auth";
import { verifyUser } from "./services/http";

function Router() {
  const navigate = useNavigate();

  const checkUser = () => {
    const token = localStorage.getItem("x-tweeter-auth");
    if (!token) return navigate("/auth");

    verifyUser(token).catch(() => navigate("/auth"));
  };

  useEffect(() => {
    checkUser();
  }, []);

  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route path="*" element={<App />} />
    </Routes>
  );
}

export default Router;
