// src/app/upload/page.jsx
'use client'
import { db, storage, auth } from '@/firebase/config'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { addDoc, collection } from 'firebase/firestore'
import { useState } from 'react'

const UploadPage = () => {
  const [file, setFile] = useState(null)
  const [title, setTitle] = useState('')

  const handleUpload = async () => {
    const storageRef = ref(storage, `media/${file.name}`)
    await uploadBytes(storageRef, file)
    const url = await getDownloadURL(storageRef)

    await addDoc(collection(db, 'media'), {
      title,
      url,
      uid: auth.currentUser?.uid,
      createdAt: new Date(),
    })
  }

  return (
    <>
      <input type="text" placeholder="Title" onChange={(e) => setTitle(e.target.value)} />
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Upload</button>
    </>
  )
}

export default UploadPage