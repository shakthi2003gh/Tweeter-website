import { Routes, Route } from "react-router-dom";
import App from "./App";
import Auth from "./pages/auth";

function Router() {
  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route path="*" element={<App />} />
    </Routes>
  );
}

export default Router;
