import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 mt-16 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        <div>
          <h4 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
            MediaApp
          </h4>
          <p className="text-sm">
            A modern cloud-native platform for sharing photos and videos. Built
            with Next.js and Google Firebase.
          </p>
        </div>

        <div>
          <h5 className="font-semibold mb-3 text-gray-900 dark:text-white">
            Links
          </h5>
          <ul className="space-y-1 text-sm">
            <li>
              <Link href="/" className="hover:underline">
                Home
              </Link>
            </li>
            <li>
              <Link href="/media" className="hover:underline">
                Explore
              </Link>
            </li>
            <li>
              <Link href="/upload" className="hover:underline">
                Upload
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h5 className="font-semibold mb-3 text-gray-900 dark:text-white">
            Creators
          </h5>
          <ul className="space-y-1 text-sm">
            <li>
              <Link href="/upload" className="hover:underline">
                Upload Content
              </Link>
            </li>
            <li>  
              <Link href="/auth/signup" className="hover:underline">
                Sign Up
              </Link>
            </li>
            <li>
              <Link href="/auth/signin" className="hover:underline">
                Sign In
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="text-center text-xs py-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-gray-500 dark:text-gray-500">
          &copy; {new Date().getFullYear()} MediaApp. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
