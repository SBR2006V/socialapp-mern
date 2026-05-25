import {
  Link,
  useNavigate,
} from "react-router-dom";

function Navbar() {
  const navigate =
    useNavigate();

  const user =
    JSON.parse(
      localStorage.getItem(
        "user"
      )
    );

  const logout = () => {
    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );

    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md px-10 py-5 flex justify-between items-center">
      <Link
        to="/"
        className="text-3xl font-bold text-blue-600"
      >
        SocialApp
      </Link>

      <div className="flex items-center gap-6">
        {user ? (
          <>
            <p className="font-medium">
              Hello,{" "}
              {
                user?.username
              }
            </p>

            <button
              onClick={
                logout
              }
              className="bg-red-500 text-white px-5 py-2 rounded-xl hover:bg-red-600 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="font-medium"
            >
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