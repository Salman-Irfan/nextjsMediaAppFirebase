// /app/api/v1/media/search/route.js
import { db } from "@/firebase/config";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const term = searchParams.get("term")?.toLowerCase();

    if (!term) {
      return Response.json({ error: "Search term is required" }, { status: 400 });
    }

    const mediaQuery = query(collection(db, "media"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(mediaQuery);

    const matched = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter(
        (doc) =>
          doc.title?.toLowerCase().includes(term) ||
          doc.location?.toLowerCase().includes(term)
      );

    return Response.json({ data: matched }, { status: 200 });
  } catch (err) {
    console.error("Search API error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
