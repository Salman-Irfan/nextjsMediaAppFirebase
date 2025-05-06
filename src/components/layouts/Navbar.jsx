'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/firebase/config';
import { ChevronDown } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setShowDropdown(false);
  };

  const isHome = pathname === '/';
  const isMedia = pathname === '/media';
  const isUpload = pathname === '/upload';

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* App Name */}
          <Link
            href="/"
            className={`text-xl font-bold px-3 py-1 rounded cursor-pointer ${
              isHome
                ? 'bg-blue-600 text-white'
                : 'text-gray-900 dark:text-white'
            }`}
          >
            MediaApp
          </Link>

          {/* Center nav item */}
          <div className="hidden md:flex items-center justify-center flex-1">
            <Link
              href="/media"
              className={`text-sm px-4 py-2 rounded shadow transition cursor-pointer ${
                isUpload
                  ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 '
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              Media
            </Link>
          </div>

          {/* Right Section */}
          <div className="hidden md:flex items-center space-x-3">
            <Link
              href="/upload"
              className={`text-sm px-4 py-2 rounded shadow transition cursor-pointer ${
                isMedia
                  ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 '
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              Upload
            </Link>

            {!user ? (
              <>
                <Link
                  href="/auth/signin"
                  className="bg-gray-200 dark:bg-gray-700 dark:text-white text-gray-900 text-sm px-4 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition cursor-pointer"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-blue-100 dark:bg-blue-900 dark:text-white text-blue-700 text-sm px-4 py-2 rounded hover:bg-blue-200 dark:hover:bg-blue-800 transition cursor-pointer"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white text-sm px-4 py-2 rounded inline-flex items-center hover:bg-gray-200 dark:hover:bg-gray-600 transition cursor-pointer"
                >
                  {user.displayName || user.email}
                  <ChevronDown className="w-4 h-4 ml-2" />
                </button>
                {showDropdown && (
                  <div className="absolute right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-lg z-10 cursor-pointer">
                    <button
                      onClick={handleLogout}
                      className="block w-full px-4 py-2 text-left text-sm text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Icon */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-900 dark:text-white focus:outline-none"
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <Link href="/media" className="block text-sm bg-blue-500 text-white px-3 py-2 rounded">
            Media
          </Link>
          <Link
            href="/upload"
            className={`block text-sm px-3 py-2 rounded ${
              isMedia
                ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white'
            }`}
          >
            Upload
          </Link>

          {!user ? (
            <>
              <Link href="/auth/signin" className="block text-sm bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-3 py-2 rounded">
                Sign In
              </Link>
              <Link href="/auth/signup" className="block text-sm bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-white px-3 py-2 rounded">
                Sign Up
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="block text-sm text-left w-full bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 rounded"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
