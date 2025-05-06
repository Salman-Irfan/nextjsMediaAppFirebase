// src/app/media/page.jsx
"use client";
import { useEffect, useState, useRef } from "react";
import { db, auth } from "@/firebase/config";
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";
import axios from "axios";
import { END_POINTS } from "@/constants/endPoints";
import { getData } from "@/services/apiServices/getData";
import { postData } from "@/services/apiServices/postData";

const MediaPage = () => {
  const [items, setItems] = useState([]);
  const [newComments, setNewComments] = useState({});
  const [newReplies, setNewReplies] = useState({});
  const [lastCursor, setLastCursor] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const observerRef = useRef();
  const [commentPageState, setCommentPageState] = useState({});
  const [replyPageState, setReplyPageState] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const fetchReplies = async (mediaId, commentId, lastVisible = null) => {
    const replyQuery = query(
      collection(db, "media", mediaId, "comments", commentId, "replies"),
      orderBy("createdAt", "desc"),
      ...(lastVisible ? [startAfter(lastVisible)] : []),
      limit(3)
    );
    const replySnap = await getDocs(replyQuery);
    return {
      replies: replySnap.docs.map((r) => ({
        id: `${commentId}-${r.id}`,
        ...r.data(),
      })),
      last: replySnap.docs[replySnap.docs.length - 1],
    };
  };

  const fetchComments = async (mediaId, lastVisible = null) => {
    const commentQuery = query(
      collection(db, "media", mediaId, "comments"),
      orderBy("createdAt", "desc"),
      ...(lastVisible ? [startAfter(lastVisible)] : []),
      limit(3)
    );
    const commentSnap = await getDocs(commentQuery);
    const comments = await Promise.all(
      commentSnap.docs.map(async (commentDoc) => {
        const comment = { id: commentDoc.id, ...commentDoc.data() };
        const { replies, last } = await fetchReplies(mediaId, comment.id);
        setReplyPageState((prev) => ({ ...prev, [comment.id]: last }));
        comment.replies = replies;
        return comment;
      })
    );
    return {
      comments,
      last: commentSnap.docs[commentSnap.docs.length - 1],
    };
  };

  const fetchMedia = async (next = false) => {
    try {
      const response = await axios.get(`${END_POINTS.MEDIA.FEED}`, {
        params: next && lastCursor ? { cursor: lastCursor } : {},
      });

      const newItems = await Promise.all(
        response.data.data.map(async (media) => {
          const { comments, last } = await fetchComments(media.id);
          setCommentPageState((prev) => ({ ...prev, [media.id]: last }));
          return { ...media, comments };
        })
      );

      setItems((prev) => {
        const seen = new Set(prev.map((item) => item.id));
        return [...prev, ...newItems.filter((item) => !seen.has(item.id))];
      });

      setLastCursor(response.data.nextCursor);
    } catch (err) {
      console.error("Failed to fetch media:", err);
    }
  };

  const searchMedia = async (term) => {
    if (!term.trim()) return fetchMedia();
    setIsSearching(true);
    try {
      const response = await getData(END_POINTS.MEDIA.SEARCH, { term });
      const results = await Promise.all(
        response.data.data.map(async (media) => {
          const { comments, last } = await fetchComments(media.id);
          setCommentPageState((prev) => ({ ...prev, [media.id]: last }));
          return { ...media, comments };
        })
      );
      setItems(results);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleLike = async (mediaId) => {
    const prevItems = [...items];
    const target = items.find((item) => item.id === mediaId);
    const prevLikes = target?.likes || 0;

    // Optimistically update the UI
    setItems((prev) =>
      prev.map((p) => (p.id === mediaId ? { ...p, likes: prevLikes + 1 } : p))
    );

    try {
      const res = await axios.post("/api/v1/media/like", { mediaId });
      const { newLikes } = res.data;

      // Update with actual server response (in case it's out of sync)
      setItems((prev) =>
        prev.map((p) => (p.id === mediaId ? { ...p, likes: newLikes } : p))
      );
    } catch (error) {
      console.error("Failed to like media:", error);

      // Revert the optimistic update if server call fails
      setItems(prevItems);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (
        entries[0].isIntersecting &&
        lastCursor &&
        !loadingMore &&
        !isSearching
      ) {
        setLoadingMore(true);
        fetchMedia(true).then(() => setLoadingMore(false));
      }
    });
    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [lastCursor, loadingMore, isSearching]);

  const handleLoadMoreComments = async (mediaId) => {
    const last = commentPageState[mediaId];

    try {
      const commentQuery = query(
        collection(db, "media", mediaId, "comments"),
        orderBy("createdAt", "desc"),
        ...(last ? [startAfter(last)] : []),
        limit(3)
      );

      const commentSnap = await getDocs(commentQuery);

      const newComments = await Promise.all(
        commentSnap.docs.map(async (doc) => {
          const comment = { id: doc.id, ...doc.data() };
          const { replies, last: lastReply } = await fetchReplies(
            mediaId,
            doc.id
          );
          setReplyPageState((prev) => ({ ...prev, [doc.id]: lastReply }));
          return { ...comment, replies };
        })
      );

      setItems((prev) =>
        prev.map((post) => {
          if (post.id !== mediaId) return post;

          const seenIds = new Set(post.comments.map((c) => c.id));
          const filtered = newComments.filter((c) => !seenIds.has(c.id));

          return {
            ...post,
            comments: [...post.comments, ...filtered],
          };
        })
      );

      const newLast = commentSnap.docs[commentSnap.docs.length - 1];
      if (newLast) {
        setCommentPageState((prev) => ({ ...prev, [mediaId]: newLast }));
      }
    } catch (err) {
      console.error("Failed to load more comments:", err);
    }
  };

  const handleLoadMoreReplies = async (mediaId, commentId) => {
    const last = replyPageState[commentId];
    const { replies, last: newLast } = await fetchReplies(
      mediaId,
      commentId,
      last
    );
    setItems((prev) =>
      prev.map((post) =>
        post.id === mediaId
          ? {
              ...post,
              comments: post.comments.map((c) =>
                c.id === commentId
                  ? {
                      ...c,
                      replies: [...c.replies, ...replies],
                    }
                  : c
              ),
            }
          : post
      )
    );
    setReplyPageState((prev) => ({ ...prev, [commentId]: newLast }));
  };

  const handleCommentSubmit = async (mediaId) => {
    const text = newComments[mediaId];
    if (!text) return;
    const newComment = {
      text,
      userId: auth.currentUser.uid,
      displayName: auth.currentUser.displayName,
      createdAt: new Date(),
    };
    const tempId = `temp-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    setItems((prev) =>
      prev.map((post) =>
        post.id === mediaId
          ? {
              ...post,
              comments: [
                { id: tempId, ...newComment, replies: [] },
                ...post.comments,
              ],
            }
          : post
      )
    );
    try {
      await postData(END_POINTS.MEDIA.COMMENT, {
        mediaId,
        comment: newComment,
      });
    } catch (err) {
      console.error("Failed to submit comment:", err);
    }
    setNewComments({ ...newComments, [mediaId]: "" });
  };

  const handleReplySubmit = async (mediaId, commentId) => {
    const text = newReplies[commentId];
    if (!text) return;
    const newReply = {
      text,
      userId: auth.currentUser.uid,
      displayName: auth.currentUser.displayName,
      createdAt: new Date(),
    };
    const tempReplyId = `temp-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    setItems((prev) =>
      prev.map((post) =>
        post.id === mediaId
          ? {
              ...post,
              comments: post.comments.map((c) =>
                c.id === commentId
                  ? {
                      ...c,
                      replies: [...c.replies, { id: tempReplyId, ...newReply }],
                    }
                  : c
              ),
            }
          : post
      )
    );
    await addDoc(
      collection(db, "media", mediaId, "comments", commentId, "replies"),
      {
        ...newReply,
        createdAt: serverTimestamp(),
      }
    );
    setNewReplies({ ...newReplies, [commentId]: "" });
  };

  const formatDate = (timestamp) => {
    try {
      const date =
        timestamp && typeof timestamp === "object" && timestamp.toDate
          ? timestamp.toDate()
          : new Date(timestamp);

      if (isNaN(date.getTime())) return ""; // fallback if date is invalid

      return new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(date);
    } catch (e) {
      console.error("Invalid timestamp:", timestamp);
      return "";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 px-4 py-8">
      <div className="flex justify-between items-center mb-6 max-w-xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Media Feed
        </h2>
        <div className="bg-yellow-100 text-yellow-800 text-sm font-semibold px-4 py-1 rounded-full dark:bg-yellow-800 dark:text-yellow-100">
          Consumer Mode
        </div>
      </div>
      <p className="text-center text-xs text-gray-500 dark:text-gray-400 mb-4">
        You can’t upload content from here.
      </p>

      <div className="max-w-xl mx-auto mb-6 space-y-2">
        <input
          type="text"
          placeholder="Search by title or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
        <div className="flex gap-2">
          <button
            onClick={() => searchMedia(searchTerm)}
            className="flex-1 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold"
          >
            Search
          </button>
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm("");
                fetchMedia();
              }}
              className="flex-1 py-2 rounded bg-gray-500 hover:bg-gray-600 text-white font-semibold"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="space-y-10 max-w-xl mx-auto">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow"
          >
            {item.type === "video" ? (
              <div className="w-full h-64 sm:h-72 md:h-80 overflow-hidden rounded-lg bg-black">
                <video
                  src={item.url}
                  controls
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-full h-64 sm:h-72 md:h-80 overflow-hidden rounded-lg bg-gray-300 dark:bg-gray-700">
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {item.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Posted by {item.displayName || "Unknown"} ·{" "}
                {formatDate(item.createdAt)}
              </p>
              {item.location && (
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  📍 {item.location}
                </p>
              )}
              {item.people && item.people.length > 0 && (
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  👥 With: {item.people.join(", ")}
                </p>
              )}
              <button
                onClick={() => handleLike(item.id)}
                className="mt-2 text-blue-600 text-sm font-medium hover:underline"
              >
                👍 Like ({item.likes || 0})
              </button>
              <div className="mt-4 space-y-4">
                {item.comments.map((comment) => (
                  <div key={`${item.id}-${comment.id}`}>
                    <p className="text-sm text-gray-800 dark:text-gray-200">
                      <span className="font-semibold">
                        {comment.displayName}:
                      </span>{" "}
                      {comment.text}
                      <span className="text-xs text-gray-400 ml-2">
                        {formatDate(comment.createdAt)}
                      </span>
                    </p>
                    <div className="ml-4 mt-2 space-y-2 border-l border-gray-300 dark:border-gray-600 pl-4">
                      {comment.replies.map((reply) => (
                        <p
                          key={`${comment.id}-${reply.id}`}
                          className="text-sm text-gray-700 dark:text-gray-300"
                        >
                          <span className="font-medium">
                            {reply.displayName}:
                          </span>{" "}
                          {reply.text}
                          <span className="text-xs text-gray-400 ml-2">
                            {formatDate(reply.createdAt)}
                          </span>
                        </p>
                      ))}
                      {replyPageState[comment.id] && (
                        <button
                          onClick={() =>
                            handleLoadMoreReplies(item.id, comment.id)
                          }
                          className="text-sm text-blue-500 hover:underline"
                        >
                          Load more replies
                        </button>
                      )}
                      <div className="flex gap-2">
                        <input
                          value={newReplies[comment.id] || ""}
                          onChange={(e) =>
                            setNewReplies({
                              ...newReplies,
                              [comment.id]: e.target.value,
                            })
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
                {commentPageState[item.id] && (
                  <button
                    onClick={() => handleLoadMoreComments(item.id)}
                    className="text-sm text-blue-500 hover:underline"
                  >
                    Load more comments
                  </button>
                )}
              </div>

              <div className="mt-4 flex gap-2">
                <input
                  value={newComments[item.id] || ""}
                  onChange={(e) =>
                    setNewComments({
                      ...newComments,
                      [item.id]: e.target.value,
                    })
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
        {!isSearching && <div ref={observerRef} className="h-10" />}
      </div>
    </div>
  );
};

export default MediaPage;
