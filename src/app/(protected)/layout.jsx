'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/firebase/config'

const ProtectedLayout = ({ children }) => {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push('/auth/signin')
      } else {
        setUser(currentUser)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [router])

  if (loading) return <div className="p-4">Loading...</div>

  return <>{children}</>
}

export default ProtectedLayout
