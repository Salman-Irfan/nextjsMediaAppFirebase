// src/components/views/homeViews/HeroSection.jsx
import React from "react";

const HeroSection = () => {
  return (
    <section className="py-20 px-6 text-center bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
      <h1 className="text-4xl font-extrabold mb-4">Welcome to SnapStream</h1>
      <p className="text-lg max-w-2xl mx-auto">
        SnapStream is a cloud-native video & photo sharing platform built for scalability, role-based interaction, and lightning-fast content delivery — inspired by platforms like Instagram.
      </p>
    </section>
  );
};

export default HeroSection;
