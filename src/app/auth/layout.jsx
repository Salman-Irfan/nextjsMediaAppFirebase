'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/firebase/config'

const AuthLayout = ({ children }) => {
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('🔐 User is already signed in, redirecting to /media')
        router.push('/media')
      } else {
        console.log('👤 No user signed in, staying on auth page')
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [router])

  if (loading) {
    return (
      <div className="p-4 text-center text-gray-600 dark:text-gray-300">
        Checking authentication...
      </div>
    )
  }

  return <>{children}</>
}

export default AuthLayout
