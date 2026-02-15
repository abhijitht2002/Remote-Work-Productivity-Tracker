import React from "react";
import { Link } from "react-router-dom";

function Register() {
  return (
    <>
      <h2 className="text-2xl font-semibold">Create your account</h2>

      <p className="mt-2 text-sm text-gray-600">
        Set up your profile to access the platform.
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

      <form className="mt-8 space-y-6">
        {/* Full Name */}
        <div>
          <label className="text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            className="mt-2 w-full border px-4 py-3 focus:outline-none focus:border-black"
          />
        </div>

        {/* Email */}
        <div>
          <label className="text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            className="mt-2 w-full border px-4 py-3 focus:outline-none focus:border-black"
          />
        </div>

        {/* Password */}
        <div>
          <label className="text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            className="mt-2 w-full border px-4 py-3 focus:outline-none focus:border-black"
          />
        </div>
        {/* Confirm password */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Confirm password
          </label>
          <input
            type="password"
            className="mt-2 w-full border px-4 py-3 focus:outline-none focus:border-black"
          />
        </div>

        <button
          type="submit"
          className="w-full border border-black bg-black text-white hover:cursor-pointer hover:bg-white hover:text-black transition py-3"
        >
          Create Account
        </button>
      </form>

      <p className="mt-6 text-sm text-gray-600">
        Already have an account?{" "}
        <Link to="/login" className="relative text-black font-medium group">
          Login
          <span className="absolute left-0 -bottom-1 h-px w-0 bg-black transition-all duration-300 group-hover:w-full"></span>
        </Link>
      </p>
    </>
  );
}

export default Register;
