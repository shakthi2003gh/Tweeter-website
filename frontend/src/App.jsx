import { Route, Routes } from "react-router-dom";
import useMediaQuery from "./hooks/useMediaQuery";
import Home from "./pages/home";
import Explore from "./pages/explore";
import Profile from "./pages/profile";
import Header from "./layouts/header";
import MobileNavigation from "./components/mobileNavigation";

function App() {
  const isMobileDisplay = !useMediaQuery(600);

  return (
    <div className="App">
      <Header />

      <main className="container">
        <Routes>
          <Route path="/profile" element={<Profile />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </main>

      {isMobileDisplay && <MobileNavigation />}
    </div>
  );
}

export default App;
