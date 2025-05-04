"use client";
import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "@/firebase/config";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

const SignUpPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const router = useRouter();

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Update user profile (optional display name)
      await updateProfile(user, {
        displayName: username,
      });

      // Save user data to Firestore (optional, for roles or profiles)
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: username,
        role: "consumer", // or assign based on logic
        createdAt: new Date(),
      });

      router.push("/upload"); // or redirect based on role
    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  return (
    <>
      <div className="p-4 max-w-md mx-auto">
        <h2 className="text-xl font-bold mb-4">Sign Up</h2>
        <input
          className="border border-gray-300 rounded p-2 mb-2 w-full"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="border border-gray-300 rounded p-2 mb-2 w-full"
          placeholder="Email"
          type="email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="border border-gray-300 rounded p-2 mb-4 w-full"
          placeholder="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleSignUp}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create Account
        </button>
      </div>
    </>
  );
};

export default SignUpPage;
