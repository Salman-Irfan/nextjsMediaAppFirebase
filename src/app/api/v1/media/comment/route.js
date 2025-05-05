// app/api/v1/media/comment/route.js
import { db } from "@/firebase/config";
import { collection, serverTimestamp, addDoc } from "firebase/firestore";

export async function POST(req) {
  try {
    const { mediaId, comment } = await req.json();

    if (!mediaId || !comment || !comment.text || !comment.userId) {
      return new Response(
        JSON.stringify({ error: "Missing required comment fields" }),
        { status: 400 }
      );
    }

    const commentData = {
      text: comment.text,
      userId: comment.userId,
      displayName: comment.displayName || "Anonymous",
      createdAt: serverTimestamp(),
    };

    await addDoc(collection(db, "media", mediaId, "comments"), commentData);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Error posting comment:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
