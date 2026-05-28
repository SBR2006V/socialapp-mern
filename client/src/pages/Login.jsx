import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../services/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post(
        "/login",
        {
          email,
          password,
        }
      );

      // Save user + token
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...res.data.user,
          token: res.data.token,
        })
      );

      toast.success(
        `Welcome back, ${res.data.user.username}!`
      );

      navigate("/");
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message ||
          "Login failed"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white p-10 rounded-3xl shadow-lg w-full max-w-md">
        <h1 className="text-4xl font-bold text-center mb-8">
          Login
        </h1>

        <form
          onSubmit={handleLogin}
          className="space-y-5"
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="w-full p-4 border rounded-xl"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="w-full p-4 border rounded-xl"
            required
          />

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-4 rounded-xl hover:bg-green-700 transition"
          >
            Login
          </button>
        </form>

        <p className="text-center mt-5">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;