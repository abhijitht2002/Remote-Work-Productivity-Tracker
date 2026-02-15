import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData);
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <h2 className="text-2xl font-semibold">Sign in to your account</h2>

      <p className="mt-2 text-sm text-gray-600">
        Enter your credentials to continue.
      </p>

      {/* Google Login */}
      <div className="mt-8">
        <button
          type="button"
          className="w-full flex items-center justify-center gap-3 border py-3 hover:bg-gray-50 transition"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />
          <span className="text-sm font-medium">Continue with Google</span>
        </button>
      </div>

      {/* Divider */}
      <div className="my-8 flex items-center">
        <div className="flex-1 border-t"></div>
        <span className="px-4 text-xs text-gray-500 uppercase">or</span>
        <div className="flex-1 border-t"></div>
      </div>

      {/* Email Login Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            onChange={handleChange}
            className="mt-2 w-full border px-4 py-3 focus:outline-none focus:border-black"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            name="password"
            onChange={handleChange}
            className="mt-2 w-full border px-4 py-3 focus:outline-none focus:border-black"
          />
        </div>

        <button
          type="submit"
          className="w-full border border-black bg-black text-white hover:cursor-pointer hover:bg-white hover:text-black transition py-3"
        >
          Sign In
        </button>
      </form>

      <p className="mt-6 text-sm text-gray-600">
        Don’t have an account?{" "}
        <Link to="/register" className="relative text-black font-medium group">
          Create account
          <span className="absolute left-0 -bottom-1 h-px w-0 bg-black transition-all duration-300 group-hover:w-full"></span>
        </Link>
      </p>
    </>
  );
}

export default Login;
