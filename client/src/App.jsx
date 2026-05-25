import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import {
  Toaster,
} from "react-hot-toast";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";

import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      <Toaster />

      <Navbar />

      <Routes>
        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={
            <Register />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;