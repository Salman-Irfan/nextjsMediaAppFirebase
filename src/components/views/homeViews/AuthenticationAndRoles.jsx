import React from "react";

const AuthenticationAndRoles = () => {
  return (
    <section className="py-12 px-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Auth & Access Control</h2>
      <ul className="list-disc ml-6 space-y-2">
        <li>Firebase Authentication is used for secure user identity management.</li>
        <li>
          Every signed-up user is assumed to be a "creator" by default — no explicit role field is set in Firestore,
          and no public interface exists for assigning roles.
        </li>
        <li>
          Protected routes (like <code>/upload</code> and <code>/media</code>) are placed under the <code>(protected)/</code> route group and use layout checks to ensure the user is signed in.
        </li>
        <li>
          Auth-only routes (like <code>/auth/signin</code> and <code>/auth/signup</code>) are placed under <code>(auth)/</code> group and are inaccessible if the user is already signed in.
        </li>
        <li>
          Server-side APIs validate user identity using UID checks to enforce access control.
        </li>
      </ul>
    </section>
  );
};

export default AuthenticationAndRoles;
