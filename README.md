# 📸 MediaApp

MediaApp is a **cloud-native video and photo sharing platform** built using **Next.js** and **Firebase**. Inspired by Instagram, it supports role-based interaction, fast media delivery, and user-friendly UI with support for authentication, media feed, uploads, and comments.


---

## 🚀 Features

- 🔐 Firebase Authentication (Sign Up, Sign In, Email Verification)
- 🌐 Public Media Feed (Consumers can browse content)
- 🎥 Media Uploads (Only creators can upload)
- 💬 Nested Comments and Replies
- 👍 Likes (Optimistic UI updates)
- 🔍 Search by title or location
- 🌓 Dark Mode Support
- 🧠 Intelligent route protection:
  - `/upload` only accessible to authenticated users (creators)
  - `/auth/*` blocked if already logged in
- 📦 Toast notifications for user feedback
- 📱 Responsive & mobile-friendly UI
- 🧱 Skeleton loaders for better UX while content loads
- 📌 Fixed Navbar with role-aware highlighting

---

## 🛠️ Tech Stack

- **Frontend**: Next.js (App Router)
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Styling**: Tailwind CSS + Dark Mode Support
- **Notifications**: react-hot-toast
- **Media Search**: Firebase Query + Search UI
- **Icons**: Lucide

---

## 🔐 Test Credentials

Use the following test account for quick access:

- **Email**: `Janmk5188@gmail.com`
- **Password**: `Testpwd@123`
