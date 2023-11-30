import AuthPage from './components/Auth/AuthPage';
import Navbar from './components/Navigation/Navbar';
import Footer from './components/Navigation/Footer';
import Home from './components/Views/Pages/Home';
import About from './components/Views/Pages/About';
import Mapboard from './components/Views/Pages/Mapboard';
import Workspace from './components/Views/Pages/Workspace';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route
          path="/mapboard"
          element={<Mapboard />}
        />
        <Route
          path="/login"
          element={<AuthPage />}
        />
        {/* <Route path="/team" element={<Teams />} />
    <Route path="/blogs" element={<Blogs />} />
    <Route
        path="/sign-up"
        element={<SignUp />}
    /> */}
        <Route
          path='/workspaces/:id'
          element={<Workspace />}
        />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
