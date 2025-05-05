import { NextResponse } from "next/server";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  startAfter,
  getFirestore,
} from "firebase/firestore";
import { db } from "@/firebase/config";

/**
 * API Route: GET /api/v1/media/feed
 * Query params:
 * - cursor (optional): Document ID to paginate from
 * - pageSize (optional): Number of items per page (default: 5)
 */

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get("cursor");
    const pageSize = parseInt(searchParams.get("pageSize") || "5");

    let mediaQuery = query(
      collection(db, "media"),
      orderBy("createdAt", "desc"),
      limit(pageSize)
    );

    // Optional pagination support
    if (cursor) {
      const lastDocSnap = await db
        .collection("media")
        .doc(cursor)
        .get();

      if (lastDocSnap.exists) {
        mediaQuery = query(
          collection(db, "media"),
          orderBy("createdAt", "desc"),
          startAfter(lastDocSnap),
          limit(pageSize)
        );
      }
    }

    const snapshot = await getDocs(mediaQuery);
    const mediaItems = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({
      success: true,
      data: mediaItems,
      nextCursor: snapshot.docs[snapshot.docs.length - 1]?.id || null,
    });
  } catch (error) {
    console.error("Error fetching media feed:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch media feed", error: error.message },
      { status: 500 }
    );
  }
}
