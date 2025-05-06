import React from "react";

const AuthenticationAndRoles = () => {
  return (
    <section className="bg-slate-50 dark:bg-slate-800 p-6 rounded-md shadow mb-8">
      <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3">
        Auth & Access Control
      </h2>
      <div className="text-slate-700 dark:text-slate-300">
        <ul className="list-inside list-disc space-y-2">
          <li>
            Firebase Authentication is used for secure user identity management.
          </li>
          <li>
            During sign-up, a verification email is automatically sent to the user’s email address.
          </li>
          <li>
            Only verified users are allowed to log in and access protected areas of the application.
          </li>
          <li>
            A <strong>“Resend Verification Email”</strong> button is provided to users who attempt to log in without verifying their email.
          </li>
          <li>
            All authentication-related messages (errors, success, verification prompts) are shown via toast notifications for consistent UX.
          </li>
          <li>
            All registered users are treated as "creators" by default; no explicit roles or role-assignment interfaces.
          </li>
          <li>
            Creator-only routes (e.g., <code>/upload</code>) are protected by layout logic in the <code>(protected)/</code> route group.
          </li>
          <li>
            Auth-only routes (e.g., <code>/auth/signin</code>, <code>/auth/signup</code>) are blocked for logged-in users via <code>(auth)/</code> layout checks.
          </li>
          <li>
            All backend APIs verify user UIDs to validate permissions before proceeding.
          </li>
        </ul>
      </div>
    </section>
  );
};

export default AuthenticationAndRoles;
