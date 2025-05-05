import { NextResponse } from "next/server";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/config";

/**
 * API Route: POST /api/v1/media/like
 * Request body: { mediaId: string }
 * Increments the like count of the specified media document.
 */

export async function POST(req) {
  try {
    const { mediaId } = await req.json();

    if (!mediaId) {
      return NextResponse.json(
        { success: false, message: "Missing mediaId" },
        { status: 400 }
      );
    }

    const postRef = doc(db, "media", mediaId);
    const postSnap = await getDoc(postRef);

    if (!postSnap.exists()) {
      return NextResponse.json(
        { success: false, message: "Media not found" },
        { status: 404 }
      );
    }

    const currentLikes = postSnap.data().likes || 0;
    await updateDoc(postRef, { likes: currentLikes + 1 });

    return NextResponse.json({ success: true, newLikes: currentLikes + 1 });
  } catch (error) {
    console.error("Error liking media:", error);
    return NextResponse.json(
      { success: false, message: "Failed to like media", error: error.message },
      { status: 500 }
    );
  }
}
