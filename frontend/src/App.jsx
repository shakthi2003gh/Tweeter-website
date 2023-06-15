import { Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import Profile from "./pages/profile";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/profile" element={<Profile />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
