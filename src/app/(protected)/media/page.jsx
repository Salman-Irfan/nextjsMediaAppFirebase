// src/app/media/page.jsx
'use client'
import { useEffect, useState } from 'react'
import { db } from '@/firebase/config'
import { collection, getDocs } from 'firebase/firestore'

const MediaPage = () => {
  const [items, setItems] = useState([])

  useEffect(() => {
    const fetchMedia = async () => {
      const snapshot = await getDocs(collection(db, 'media'))
      setItems(snapshot.docs.map(doc => doc.data()))
    }
    fetchMedia()
  }, [])

  return (
    <>
      {items.map((item, index) => (
        <div key={index}>
          <h3>{item.title}</h3>
          <img src={item.url} alt={item.title} width={200} />
        </div>
      ))}
    </>
  )
}

export default MediaPage
