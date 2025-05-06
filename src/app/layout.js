import { Toaster } from "react-hot-toast";
import "./globals.css";
import Navbar from "@/components/layouts/Navbar";
import Footer from "@/components/layouts/Footer";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <Toaster position="top-right" />
        {children}
        <Footer/>
      </body>
    </html>
  );
}
