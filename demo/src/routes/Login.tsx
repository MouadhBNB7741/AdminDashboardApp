import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { authContext } from "../context/context";
import { type User } from "../types";

export default function Login() {
  const { login } = useContext(authContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Simulate fetching users from localStorage or a real API in production
    const storedUsers = localStorage.getItem("users");
    const users: User[] = storedUsers ? JSON.parse(storedUsers) : [];

    // Find user by email and password
    const user = users.find(
      (user) =>
        user.mail === formData.email && user.password === formData.password // Note: This is insecure; only for demo
    );

    if (!user) {
      setError("Invalid email or password.");
      return;
    }

    // Log the user in (this would typically set auth tokens in real app)
    login(user, user.id);
    navigate("/");
  };

  // Placeholder functions for social logins
  const handleGoogleLogin = () => {
    alert("Google login clicked (not implemented yet)");
  };

  const handleFacebookLogin = () => {
    alert("Facebook login clicked (not implemented yet)");
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-900 text-white">
      {/* Side Image Section */}
      <div
        className="hidden md:flex md:w-1/2 bg-cover bg-center rounded-r-3xl relative"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1617849206575-94de8a5c3f8d?auto=format&fit=crop&w=1470&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 via-transparent to-gray-900/70"></div>
        <div className="relative p-10 w-full flex items-center justify-center">
          <div className="text-white max-w-lg">
            <h2 className="text-4xl font-bold mb-4">
              Your Health is Our Priority
            </h2>
            <p className="text-lg opacity-90">
              Join thousands of professionals helping patients live better
              lives. Sign up today and start your journey with us.
            </p>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-md">
          <h1 className="text-3xl font-bold text-center text-white mb-6">
            Welcome Back
          </h1>

          {error && (
            <div className="bg-red-900 border-l-4 border-red-500 text-red-200 p-3 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder:text-gray-400"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder:text-gray-400"
                minLength={6}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition duration-200"
            >
              Log In
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-grow h-px bg-gray-600"></div>
            <span className="mx-4 text-gray-400">or</span>
            <div className="flex-grow h-px bg-gray-600"></div>
          </div>

          {/* Social Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 px-4 py-2 bg-white text-gray-800 rounded-lg hover:bg-gray-200 transition"
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                className="w-5 h-5"
              />
              <span>Log in with Google</span>
            </button>

            <button
              onClick={handleFacebookLogin}
              className="w-full flex items-center justify-center gap-3 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition"
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/facebook.svg"
                alt="Facebook"
                className="w-5 h-5"
              />
              <span>Log in with Facebook</span>
            </button>
          </div>

          <p className="text-center mt-6 text-gray-400">
            Don't have an account?{" "}
            <a
              href="/sign-up"
              className="text-blue-400 hover:underline font-medium"
            >
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
