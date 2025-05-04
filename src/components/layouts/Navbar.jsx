'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '@/firebase/config'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [showDropdown, setShowDropdown] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })
    return () => unsubscribe()
  }, [])

  const handleLogout = async () => {
    await signOut(auth)
    setShowDropdown(false)
  }

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-semibold text-gray-900 dark:text-white">
            MediaApp
          </Link>

          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-900 dark:text-white focus:outline-none"
            >
              ☰
            </button>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link href="/" className="text-gray-900 dark:text-white hover:underline">
              Home
            </Link>
            <Link href="/media" className="text-gray-900 dark:text-white hover:underline">
              Media
            </Link>
            <Link href="/upload" className="text-gray-900 dark:text-white hover:underline">
              Upload
            </Link>

            {!user ? (
              <>
                <Link href="/auth/signin" className="text-gray-900 dark:text-white hover:underline">
                  Sign In
                </Link>
                <Link href="/auth/signup" className="text-gray-900 dark:text-white hover:underline">
                  Sign Up
                </Link>
              </>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="text-gray-900 dark:text-white font-medium hover:underline"
                >
                  {user.displayName || user.email}
                </button>
                {showDropdown && (
                  <div className="absolute right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded shadow-md z-10">
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
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2">
          <Link href="/" className="block text-gray-900 dark:text-white hover:underline">Home</Link>
          <Link href="/media" className="block text-gray-900 dark:text-white hover:underline">Media</Link>
          <Link href="/upload" className="block text-gray-900 dark:text-white hover:underline">Upload</Link>

          {!user ? (
            <>
              <Link href="/auth/signin" className="block text-gray-900 dark:text-white hover:underline">Sign In</Link>
              <Link href="/auth/signup" className="block text-gray-900 dark:text-white hover:underline">Sign Up</Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="block text-left w-full text-gray-900 dark:text-white hover:underline"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar
