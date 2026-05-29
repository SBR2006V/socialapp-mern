import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  // FIX: Removed localStorage.removeItem("token") — that key doesn't exist.
  // The token lives inside the "user" object, so removing "user" is enough.
  const logout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md px-10 py-5 flex justify-between items-center">
      <Link to="/" className="text-3xl font-bold text-blue-600">
        SocialApp
      </Link>

      <div className="flex items-center gap-6">
        {user ? (
          <>
            {/* FIX: Wrap username in a Link so clicking it goes to your profile */}
            <Link
              to={`/profile/${user?.id}`}
              className="font-medium hover:text-blue-600 transition"
            >
              Hello, {user?.username}
            </Link>

            <button
              onClick={logout}
              className="bg-red-500 text-white px-5 py-2 rounded-xl hover:bg-red-600 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="font-medium">
              Login
            </Link>

            <Link
              to="/register"
              className="bg-blue-600 text-white px-5 py-2 rounded-xl"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
