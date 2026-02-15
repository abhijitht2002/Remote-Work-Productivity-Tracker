import React from "react";

function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900 px-6">
      {/* HERO */}
      <section className="max-w-5xl mx-auto text-center py-32">
        <h1 className="text-5xl font-semibold tracking-tight">
          Remote Work Tracker
        </h1>

        <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
          A centralized platform to manage distributed teams, track work hours,
          and maintain transparent task reporting across your organization.
        </p>

        <div className="mt-10">
          <button className="px-8 py-3 border border-black text-black hover:cursor-pointer hover:bg-black hover:text-white transition">
            Get Started
          </button>
        </div>
      </section>

      {/* ROLES */}
      <section className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 py-20 border-t">
        {/* Manager */}
        <div className="group border p-8 transition hover:shadow-md hover:-translate-y-1 cursor-pointer">
          <h3 className="text-xl font-medium">Manager</h3>

          <p className="mt-4 text-gray-600 text-sm">
            Assign tasks, review submissions, monitor team productivity, and
            maintain structured reporting across projects.
          </p>

          <div className="mt-6">
            <span className="inline-flex items-center text-sm font-medium text-black">
              Explore capabilities
              <span className="ml-2 transition-transform group-hover:translate-x-1">
                →
              </span>
            </span>
          </div>
        </div>

        {/* Employee */}
        <div className="group border p-8 transition hover:shadow-md hover:-translate-y-1 cursor-pointer">
          <h3 className="text-xl font-medium">Employee</h3>

          <p className="mt-4 text-gray-600 text-sm">
            Log work hours, update task progress, and provide clear
            documentation of completed work in a structured format.
          </p>

          <div className="mt-6">
            <span className="inline-flex items-center text-sm font-medium text-black">
              See workflow
              <span className="ml-2 transition-transform group-hover:translate-x-1">
                →
              </span>
            </span>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-4xl mx-auto py-24 border-t text-center">
        <h2 className="text-3xl font-semibold">
          Built for Structured Remote Collaboration
        </h2>

        <p className="mt-6 text-gray-600 leading-relaxed">
          Remote Work Tracker simplifies how distributed teams operate. Managers
          assign structured tasks. Employees log progress and time spent. All
          activity is recorded in a centralized system designed to improve
          clarity and accountability.
        </p>
      </section>

      {/* PRODUCTIVITY SECTION */}
      <section className="max-w-5xl mx-auto py-24 border-t grid md:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-3xl font-semibold">
            Transparency Without Micromanagement
          </h2>

          <p className="mt-6 text-gray-600 leading-relaxed">
            Track work hours and task completion without unnecessary meetings or
            constant follow-ups. The system ensures visibility while maintaining
            team autonomy.
          </p>
        </div>

        <div className="grid gap-8 text-sm">
          <div>
            <h4 className="font-medium text-gray-900">
              Structured Task Assignment
            </h4>
            <p className="mt-2 text-gray-600">
              Define tasks clearly with deadlines and ownership to reduce
              ambiguity.
            </p>
          </div>

          <div>
            <h4 className="font-medium text-gray-900">
              Centralized Time Logging
            </h4>
            <p className="mt-2 text-gray-600">
              Maintain consistent records of hours worked across teams.
            </p>
          </div>

          <div>
            <h4 className="font-medium text-gray-900">Organized Reporting</h4>
            <p className="mt-2 text-gray-600">
              Access structured updates without scattered communication.
            </p>
          </div>

          <div>
            <h4 className="font-medium text-gray-900">
              Performance Visibility
            </h4>
            <p className="mt-2 text-gray-600">
              Gain insights into progress while preserving team autonomy.
            </p>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="max-w-4xl mx-auto py-32 border-t text-center">
        <h2 className="text-3xl font-semibold">
          Start Managing Remote Work Efficiently
        </h2>

        <div className="mt-10">
          <button className="px-8 py-3 border border-black bg-black text-white hover:cursor-pointer hover:bg-white hover:text-black transition">
            Create Account
          </button>
        </div>
      </section>
    </div>
  );
}

export default Home;
