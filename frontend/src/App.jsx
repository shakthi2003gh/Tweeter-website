import { Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import Profile from "./pages/profile";
import Header from "./layouts/header";

function App() {
  return (
    <div className="App">
      <Header />

      <Routes>
        <Route path="/profile" element={<Profile />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
