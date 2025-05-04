"use client";
import { db, storage, auth } from "@/firebase/config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleUpload = async () => {
    if (!file || !title) return;

    setUploading(true);
    try {
      const storageRef = ref(storage, `media/${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      const user = auth.currentUser;
      const displayName = user?.displayName || "Unknown";

      await addDoc(collection(db, "media"), {
        title,
        url,
        uid: user?.uid,
        displayName, // ✅ now storing user's name in the media doc
        createdAt: new Date(),
      });

      setSuccess(true);
      setTitle("");
      setFile(null);
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="bg-white dark:bg-gray-800 w-full max-w-md p-6 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
          Upload New Post
        </h2>

        {success && (
          <div className="mb-4 text-green-600 text-sm text-center">
            ✅ Uploaded successfully!
          </div>
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
            type="file"
            accept="image/*"
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
