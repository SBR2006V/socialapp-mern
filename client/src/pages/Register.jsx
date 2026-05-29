import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../services/api";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      // FIX: Wrong URL was "/register" — backend mounts at /api/auth/register
      const res = await API.post("/auth/register", { username, email, password });

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...res.data.user,
          token: res.data.token,
        })
      );

      toast.success("Registered Successfully");

      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white p-10 rounded-3xl shadow-lg w-full max-w-md">
        <h1 className="text-4xl font-bold text-center mb-8">Register</h1>

        <form onSubmit={handleRegister} className="space-y-5">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-4 border rounded-xl"
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 border rounded-xl"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 border rounded-xl"
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-4 rounded-xl hover:bg-blue-700 transition"
          >
            Register
          </button>
        </form>

        <p className="text-center mt-5">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
