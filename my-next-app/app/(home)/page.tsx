"use client";
import { useEffect } from "react";
import "../globals.css";

const Home = () => {
  useEffect(() => {
    if (typeof window !== "undefined") {
    }
  }, []);
  return (
    <div className="flex justify-center items-center min-h-screen bg-blue-100">
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-blue-600">Test Page</h1>
        <p className="mt-2 text-gray-600">Testing Tailwind CSS</p>
      </div>
    </div>
  );
};

export default Home;
