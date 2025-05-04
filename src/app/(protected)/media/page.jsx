// src/app/media/page.jsx
'use client'
import { useEffect, useState } from 'react'
import { db, auth } from '@/firebase/config'
import {
  collection,
  getDocs,
  addDoc,
  doc,
  serverTimestamp
} from 'firebase/firestore'

const MediaPage = () => {
  const [items, setItems] = useState([])
  const [newComments, setNewComments] = useState({})
  const [newReplies, setNewReplies] = useState({})

  const fetchMedia = async () => {
    const snapshot = await getDocs(collection(db, 'media'))
    const data = await Promise.all(
      snapshot.docs.map(async (mediaDoc) => {
        const media = { id: mediaDoc.id, ...mediaDoc.data() }

        const commentsSnapshot = await getDocs(
          collection(db, 'media', media.id, 'comments')
        )

        const comments = await Promise.all(
          commentsSnapshot.docs.map(async (commentDoc) => {
            const comment = { id: commentDoc.id, ...commentDoc.data() }
            const repliesSnapshot = await getDocs(
              collection(db, 'media', media.id, 'comments', comment.id, 'replies')
            )
            comment.replies = repliesSnapshot.docs.map((r) => ({ id: r.id, ...r.data() }))
            return comment
          })
        )

        return { ...media, comments }
      })
    )
    setItems(data)
  }

  useEffect(() => {
    fetchMedia()
  }, [])

  const handleCommentSubmit = async (mediaId) => {
    const text = newComments[mediaId]
    if (!text) return

    const optimisticComment = {
      id: `temp-${Date.now()}`,
      text,
      displayName: auth.currentUser.displayName,
      replies: [],
    }

    setItems((prev) =>
      prev.map((item) =>
        item.id === mediaId
          ? { ...item, comments: [...item.comments, optimisticComment] }
          : item
      )
    )
    setNewComments({ ...newComments, [mediaId]: '' })

    await addDoc(collection(db, 'media', mediaId, 'comments'), {
      text,
      userId: auth.currentUser.uid,
      displayName: auth.currentUser.displayName,
      createdAt: serverTimestamp(),
    })
  }

  const handleReplySubmit = async (mediaId, commentId) => {
    const text = newReplies[commentId]
    if (!text) return

    const optimisticReply = {
      id: `temp-reply-${Date.now()}`,
      text,
      displayName: auth.currentUser.displayName,
    }

    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== mediaId) return item
        return {
          ...item,
          comments: item.comments.map((comment) =>
            comment.id === commentId
              ? { ...comment, replies: [...comment.replies, optimisticReply] }
              : comment
          ),
        }
      })
    )
    setNewReplies({ ...newReplies, [commentId]: '' })

    await addDoc(collection(db, 'media', mediaId, 'comments', commentId, 'replies'), {
      text,
      userId: auth.currentUser.uid,
      displayName: auth.currentUser.displayName,
      createdAt: serverTimestamp(),
    })
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 px-4 py-8">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
        Media Feed
      </h2>

      <div className="space-y-10 max-w-xl mx-auto">
        {items.map((item) => (
          <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <img src={item.url} alt={item.title} className="w-full h-auto object-cover" />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {item.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Posted by {item.displayName || 'Unknown'}
              </p>

              {/* Comments */}
              <div className="mt-4 space-y-4">
                {item.comments.map((comment) => (
                  <div key={comment.id}>
                    <p className="text-sm text-gray-800 dark:text-gray-200">
                      <span className="font-semibold">{comment.displayName}:</span> {comment.text}
                    </p>

                    {/* Replies */}
                    <div className="ml-4 mt-2 space-y-2 border-l border-gray-300 dark:border-gray-600 pl-4">
                      {comment.replies.map((reply) => (
                        <p key={reply.id} className="text-sm text-gray-700 dark:text-gray-300">
                          <span className="font-medium">{reply.displayName}:</span> {reply.text}
                        </p>
                      ))}
                      <div className="flex gap-2">
                        <input
                          value={newReplies[comment.id] || ''}
                          onChange={(e) =>
                            setNewReplies({ ...newReplies, [comment.id]: e.target.value })
                          }
                          placeholder="Write a reply..."
                          className="w-full text-sm px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                        <button
                          onClick={() => handleReplySubmit(item.id, comment.id)}
                          className="text-blue-600 text-sm font-medium"
                        >
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* New Comment */}
              <div className="mt-4 flex gap-2">
                <input
                  value={newComments[item.id] || ''}
                  onChange={(e) =>
                    setNewComments({ ...newComments, [item.id]: e.target.value })
                  }
                  placeholder="Write a comment..."
                  className="w-full text-sm px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <button
                  onClick={() => handleCommentSubmit(item.id)}
                  className="text-blue-600 text-sm font-medium"
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MediaPage;
