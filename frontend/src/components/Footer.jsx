import React from "react";

function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-10 text-sm text-gray-600">
        {/* Product */}
        <div>
          <h4 className="font-medium text-gray-900">Product</h4>
          <p className="mt-4">
            A structured platform for managing distributed teams with clarity
            and accountability.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="font-medium text-gray-900">Navigation</h4>
          <div className="mt-4 space-y-2">
            <div>Login</div>
            <div>Register</div>
          </div>
        </div>

        {/* Legal */}
        <div>
          <h4 className="font-medium text-gray-900">Company</h4>
          <div className="mt-4 space-y-2">
            <div>Privacy Policy</div>
            <div>Terms of Service</div>
          </div>
        </div>
      </div>

      <div className="border-t text-center text-xs text-gray-500 py-6">
        © {new Date().getFullYear()} Remote Work Tracker. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
