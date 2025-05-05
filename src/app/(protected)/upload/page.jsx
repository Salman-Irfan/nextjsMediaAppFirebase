"use client";
import { useState } from "react";
import axios from "axios";
import { auth } from "@/firebase/config";
import { postData } from "@/services/apiServices/postData";
import { END_POINTS } from "@/constants/endPoints";

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [people, setPeople] = useState("");
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async () => {
    if (!file || !title || !auth.currentUser) {
      setError("Missing required fields or not authenticated.");
      return;
    }
  
    setUploading(true);
    setError("");
    setSuccess(false);
  
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title);
      formData.append("location", location);
      formData.append("people", people);
      formData.append("uid", auth.currentUser.uid);
      formData.append("displayName", auth.currentUser.displayName || "Unknown");
  
      const response = await postData(END_POINTS.MEDIA.UPLOAD_POST, formData);
  
      if (response.success) {
        setSuccess(true);
        setTitle("");
        setLocation("");
        setPeople("");
        setFile(null);
      } else {
        setError(response.message || "Upload failed.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError("An error occurred during upload.");
    } finally {
      setUploading(false);
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center px-4 py-8">
      <div className="flex justify-between items-center w-full max-w-md mb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Upload New Post
        </h2>
        <div className="bg-green-100 text-green-800 text-sm font-semibold px-4 py-1 rounded-full dark:bg-green-800 dark:text-green-100">
          Creator Mode
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 w-full max-w-md p-6 rounded shadow-md">
        {success && (
          <div className="mb-4 text-green-600 text-sm text-center">
            ✅ Uploaded successfully!
          </div>
        )}
        {error && (
          <div className="mb-4 text-red-600 text-sm text-center">{error}</div>
        )}

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Write a caption..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring focus:border-blue-500"
          />

          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring focus:border-blue-500"
          />

          <input
            type="text"
            placeholder="People (comma-separated)"
            value={people}
            onChange={(e) => setPeople(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring focus:border-blue-500"
          />

          <input
            type="file"
            accept="image/*,video/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="block w-full text-sm text-gray-500 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-700 dark:file:text-gray-100"
          />

          <button
            onClick={handleUpload}
            disabled={uploading}
            className={`w-full py-2 px-4 rounded text-white font-semibold transition ${
              uploading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
