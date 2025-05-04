// src/app/auth/signin/page.jsx
'use client'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/firebase/config'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const SignInPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleLogin = async () => {
    await signInWithEmailAndPassword(auth, email, password)
    router.push('/upload')
  }

  return (
    <>
      <input placeholder="email" onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="password" type="password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
    </>
  )
}
export default SignInPage