"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { postData } from "@/services/apiServices/postData";
import { END_POINTS } from "@/constants/endPoints";
import { toast } from "react-hot-toast";

const SignUpPage = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSignUp = async () => {
    setLoading(true);
    try {
      const data = await postData(END_POINTS.AUTH.SIGN_UP, {
        email,
        password,
        username,
      });

      if (data.success) {
        toast.success("Verification email sent. Please check your inbox.");
        router.push("/auth/signin");
      } else {
        toast.error(data.message || "Signup failed");
      }
    } catch (err) {
      toast.error("Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-6 rounded shadow">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
          Create Account
        </h2>

        <div className="space-y-4">
          {/* Inputs remain unchanged */}
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 pr-10 border border-gray-300 dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-600 dark:text-gray-300"
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          <button
            onClick={handleSignUp}
            disabled={loading}
            className={`w-full flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition disabled:opacity-60 disabled:cursor-not-allowed`}
          >
            {loading ? (
              <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              "Sign Up"
            )}
          </button>

          <p className="text-sm text-center text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link href="/auth/signin" className="text-blue-600 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
