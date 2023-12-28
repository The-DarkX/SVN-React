import AuthPage from './components/Auth/AuthPage';
import Navbar from './components/Navigation/Navbar';
import Footer from './components/Navigation/Footer';
import Home from './components/Views/Pages/Home';
import About from './components/Views/Pages/About';
import Mapboard from './components/Views/Pages/Mapboard';
import Workspace from './components/Views/Pages/Workspace';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Alert } from '@mui/joy';

function App() {
  if (sessionStorage.getItem('user-location') === null) {
    if ('geolocation' in navigator) {
      // Geolocation is available
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Success callback - user's location obtained
          const { latitude, longitude } = position.coords;
          // console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);

          sessionStorage.setItem('user-location', JSON.stringify([longitude, latitude]));

          location.reload();
          // Use the latitude and longitude as needed (e.g., for map display)
        },
        (error) => {
          // Error callback - handle errors
          switch (error.code) {
            case error.PERMISSION_DENIED:
              console.error('User denied the request for Geolocation.');
              break;
            case error.POSITION_UNAVAILABLE:
              console.error('Location information is unavailable.');
              break;
            case error.TIMEOUT:
              console.error('The request to get user location timed out.');
              break;
            case error.UNKNOWN_ERROR:
              console.error('An unknown error occurred.');
              break;
            default:
              console.error('An error occurred while retrieving location.');
          }
        }
      );
    } else {
      // Geolocation is not supported by the browser
      console.error('Geolocation is not supported by this browser.');
    }
  }

  return (
    <>
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
    </>
  );
}

export default App;
