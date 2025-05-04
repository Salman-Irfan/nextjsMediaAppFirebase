// src/app/media/page.jsx
'use client'
import { useEffect, useState, useRef, useCallback } from 'react'
import { db, auth } from '@/firebase/config'
import {
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  getDocs,
  addDoc,
  doc,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore'

const MediaPage = () => {
  const [items, setItems] = useState([])
  const [lastDoc, setLastDoc] = useState(null)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [newComments, setNewComments] = useState({})
  const [newReplies, setNewReplies] = useState({})
  const observer = useRef()

  const fetchMedia = async (initial = false) => {
    setLoading(true)
    let q = query(collection(db, 'media'), orderBy('createdAt', 'desc'), limit(5))
    if (lastDoc && !initial) {
      q = query(q, startAfter(lastDoc))
    }

    const snapshot = await getDocs(q)
    if (snapshot.empty) {
      setHasMore(false)
      setLoading(false)
      return
    }

    const newLastDoc = snapshot.docs[snapshot.docs.length - 1]
    setLastDoc(newLastDoc)

    const data = await Promise.all(
      snapshot.docs.map(async (mediaDoc) => {
        const media = { id: mediaDoc.id, ...mediaDoc.data() }
        const commentsData = await fetchPaginatedComments(media.id)
        return { ...media, comments: commentsData.comments, commentsLastDoc: commentsData.lastDoc, hasMoreComments: commentsData.hasMore }
      })
    )

    setItems((prev) => [...prev, ...data])
    setLoading(false)
  }

  const fetchPaginatedComments = async (mediaId, last = null) => {
    let q = query(collection(db, 'media', mediaId, 'comments'), orderBy('createdAt'), limit(3))
    if (last) q = query(q, startAfter(last))

    const snapshot = await getDocs(q)
    const lastDoc = snapshot.docs[snapshot.docs.length - 1]

    const comments = await Promise.all(
      snapshot.docs.map(async (commentDoc) => {
        const comment = { id: commentDoc.id, ...commentDoc.data() }
        const repliesData = await fetchPaginatedReplies(mediaId, comment.id)
        comment.replies = repliesData.replies
        comment.repliesLastDoc = repliesData.lastDoc
        comment.hasMoreReplies = repliesData.hasMore
        return comment
      })
    )

    return { comments, lastDoc, hasMore: snapshot.docs.length === 3 }
  }

  const fetchPaginatedReplies = async (mediaId, commentId, last = null) => {
    let q = query(collection(db, 'media', mediaId, 'comments', commentId, 'replies'), orderBy('createdAt'), limit(3))
    if (last) q = query(q, startAfter(last))
    const snapshot = await getDocs(q)
    const lastDoc = snapshot.docs[snapshot.docs.length - 1]
    return {
      replies: snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
      lastDoc,
      hasMore: snapshot.docs.length === 3
    }
  }

  const loadMoreComments = async (mediaId) => {
    const mediaIndex = items.findIndex((item) => item.id === mediaId)
    const current = items[mediaIndex]
    const data = await fetchPaginatedComments(mediaId, current.commentsLastDoc)
    const updated = {
      ...current,
      comments: [...current.comments, ...data.comments],
      commentsLastDoc: data.lastDoc,
      hasMoreComments: data.hasMore
    }
    const newItems = [...items]
    newItems[mediaIndex] = updated
    setItems(newItems)
  }

  const loadMoreReplies = async (mediaId, commentId) => {
    const mediaIndex = items.findIndex((item) => item.id === mediaId)
    const commentIndex = items[mediaIndex].comments.findIndex((c) => c.id === commentId)
    const data = await fetchPaginatedReplies(mediaId, commentId, items[mediaIndex].comments[commentIndex].repliesLastDoc)
    const updatedReplies = [...items[mediaIndex].comments[commentIndex].replies, ...data.replies]
    const updatedComment = {
      ...items[mediaIndex].comments[commentIndex],
      replies: updatedReplies,
      repliesLastDoc: data.lastDoc,
      hasMoreReplies: data.hasMore
    }
    const updatedComments = [...items[mediaIndex].comments]
    updatedComments[commentIndex] = updatedComment
    const updatedMedia = { ...items[mediaIndex], comments: updatedComments }
    const newItems = [...items]
    newItems[mediaIndex] = updatedMedia
    setItems(newItems)
  }

  useEffect(() => {
    fetchMedia(true)
  }, [])

  const lastItemRef = useCallback(
    (node, index) => {
      if (loading || !hasMore) return
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          fetchMedia()
        }
      })
      if (node) observer.current.observe(node)
    },
    [loading, hasMore]
  )

  const handleCommentSubmit = async (mediaId) => {
    const text = newComments[mediaId]
    if (!text) return
    const optimisticComment = {
      id: `temp-${Date.now()}`,
      text,
      displayName: auth.currentUser.displayName,
      replies: [],
      createdAt: new Date()
    }
    setItems((prev) =>
      prev.map((item) =>
        item.id === mediaId ? { ...item, comments: [...item.comments, optimisticComment] } : item
      )
    )
    setNewComments({ ...newComments, [mediaId]: '' })
    await addDoc(collection(db, 'media', mediaId, 'comments'), {
      text,
      userId: auth.currentUser.uid,
      displayName: auth.currentUser.displayName,
      createdAt: serverTimestamp()
    })
  }

  const handleReplySubmit = async (mediaId, commentId) => {
    const text = newReplies[commentId]
    if (!text) return
    const optimisticReply = {
      id: `temp-${Date.now()}`,
      text,
      displayName: auth.currentUser.displayName,
      createdAt: new Date()
    }
    setItems((prev) =>
      prev.map((item) =>
        item.id === mediaId
          ? {
              ...item,
              comments: item.comments.map((comment) =>
                comment.id === commentId
                  ? { ...comment, replies: [...comment.replies, optimisticReply] }
                  : comment
              )
            }
          : item
      )
    )
    setNewReplies({ ...newReplies, [commentId]: '' })
    await addDoc(collection(db, 'media', mediaId, 'comments', commentId, 'replies'), {
      text,
      userId: auth.currentUser.uid,
      displayName: auth.currentUser.displayName,
      createdAt: serverTimestamp()
    })
  }

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return ''
    const date = timestamp instanceof Timestamp ? timestamp.toDate() : timestamp
    return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(date)
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 px-4 py-8">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
        Media Feed
      </h2>
      <div className="space-y-10 max-w-xl mx-auto">
        {items.map((item, index) => (
          <div
            key={`${item.id}-${index}`}
            className="bg-white dark:bg-gray-800 rounded-lg shadow"
            ref={index === items.length - 3 ? (node) => lastItemRef(node, index) : null}
          >
            <img src={item.url} alt={item.title} className="w-full h-auto object-cover" />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {item.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Posted by {item.displayName || 'Unknown'} • {formatTimestamp(item.createdAt)}
              </p>

              <div className="mt-4 space-y-4">
                {item.comments.map((comment) => (
                  <div key={comment.id}>
                    <p className="text-sm text-gray-800 dark:text-gray-200">
                      <span className="font-semibold">{comment.displayName}:</span> {comment.text}
                      <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">{formatTimestamp(comment.createdAt)}</span>
                    </p>
                    <div className="ml-4 mt-2 space-y-2 border-l border-gray-300 dark:border-gray-600 pl-4">
                      {comment.replies.map((reply) => (
                        <p key={reply.id} className="text-sm text-gray-700 dark:text-gray-300">
                          <span className="font-medium">{reply.displayName}:</span> {reply.text}
                          <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">{formatTimestamp(reply.createdAt)}</span>
                        </p>
                      ))}
                      {comment.hasMoreReplies && (
                        <button
                          onClick={() => loadMoreReplies(item.id, comment.id)}
                          className="text-xs text-blue-600 hover:underline"
                        >
                          Load more replies
                        </button>
                      )}
                      <div className="flex gap-2">
                        <input
                          value={newReplies[comment.id] || ''}
                          onChange={(e) => setNewReplies({ ...newReplies, [comment.id]: e.target.value })}
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
                {item.hasMoreComments && (
                  <button
                    onClick={() => loadMoreComments(item.id)}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Load more comments
                  </button>
                )}
              </div>

              <div className="mt-4 flex gap-2">
                <input
                  value={newComments[item.id] || ''}
                  onChange={(e) => setNewComments({ ...newComments, [item.id]: e.target.value })}
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
        {loading && (
          <p className="text-center text-gray-600 dark:text-gray-400">Loading more posts...</p>
        )}
      </div>
    </div>
  )
}

export default MediaPage;
