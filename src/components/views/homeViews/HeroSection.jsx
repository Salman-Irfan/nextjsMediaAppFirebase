// src/components/views/homeViews/HeroSection.jsx
import React from "react";

const HeroSection = () => {
  return (
    <>
      <section className="py-20 px-6 text-center bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <h1 className="text-4xl font-extrabold mb-4">Welcome to SnapStream</h1>
        <p className="text-lg max-w-2xl mx-auto">
          SnapStream is a cloud-native video & photo sharing platform built for
          scalability, role-based interaction, and lightning-fast content
          delivery — inspired by platforms like Instagram.
        </p>
      <div className="mt-8 bg-white text-blue-900 dark:text-white dark:bg-gray-800 rounded-lg shadow inline-block px-6 py-4 text-left max-w-md mx-auto">
        <h2 className="text-lg font-semibold mb-2">Test Credentials</h2>
        <p>
          <span className="font-medium">Email:</span> janmk5188@gmail.com
        </p>
        <p>
          <span className="font-medium">Password:</span> Testpwd@123
        </p>
        <p className="text-sm text-gray-500 mt-2 dark:text-gray-400">
          Use these to try out the app's media features!
        </p>
      </div>
      </section>
    </>
  );
};

export default HeroSection;
