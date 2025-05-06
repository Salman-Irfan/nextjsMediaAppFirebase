"use client";
import { useState } from "react";
import {
  signInWithEmailAndPassword,
  sendEmailVerification,
  signOut,
} from "firebase/auth";
import { auth } from "@/firebase/config";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";

const SignInPage = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [unverifiedUser, setUnverifiedUser] = useState(null);
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      if (!user.emailVerified) {
        toast.error("Your email is not verified. Please check your inbox.");
        setUnverifiedUser(user);
        await signOut(auth);
        return;
      }

      toast.success("Login successful!");
      router.push("/media");
    } catch (err) {
      console.error("Login failed:", err);
      toast.error("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (unverifiedUser) {
      try {
        await sendEmailVerification(unverifiedUser);
        toast.success("Verification email sent. Please check your inbox.");
        setUnverifiedUser(null);
      } catch (err) {
        console.error("Failed to send verification email:", err);
        toast.error("Failed to resend verification email.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-6 rounded shadow">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
          Sign In
        </h2>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 pr-10 border border-gray-300 dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-600 dark:text-gray-300"
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className={`w-full flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition disabled:opacity-60 disabled:cursor-not-allowed`}
          >
            {loading ? (
              <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              "Login"
            )}
          </button>

          {unverifiedUser && (
            <button
              onClick={handleResendVerification}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded mt-2"
            >
              Resend Verification Email
            </button>
          )}

          <p className="text-sm text-center text-gray-600 dark:text-gray-400">
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="text-blue-600 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
