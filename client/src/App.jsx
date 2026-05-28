import {
  Routes,
  Route,
} from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Temporary Profile Page
function Profile() {
  return (
    <div className="min-h-screen flex items-center justify-center text-3xl font-bold">
      Profile Page
    </div>
  );
}

function App() {
  return (
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
        element={<Register />}
      />

      <Route
        path="/profile/:id"
        element={<Profile />}
      />
    </Routes>
  );
}

export default App;