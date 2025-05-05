// app/api/v1/creator/upload-post/route.js

import { NextResponse } from "next/server";
import { db, storage } from "@/firebase/config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

export async function POST(req) {
  try {
    const formData = await req.formData();

    const file = formData.get("file");
    const title = formData.get("title");
    const location = formData.get("location") || "";
    const people = formData.get("people")?.split(",").map((p) => p.trim()) || [];
    const uid = formData.get("uid");
    const displayName = formData.get("displayName") || "Unknown";

    if (!file || !title || !uid) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const fileExtension = file.name.split(".").pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    const fileRef = ref(storage, `media/${fileName}`);

    const buffer = Buffer.from(await file.arrayBuffer());
    await uploadBytes(fileRef, buffer, { contentType: file.type });
    const url = await getDownloadURL(fileRef);

    const fileType = file.type.startsWith("video") ? "video" : "image";

    await addDoc(collection(db, "media"), {
      title,
      location,
      people,
      url,
      uid,
      displayName,
      createdAt: serverTimestamp(),
      type: fileType,
    });

    return NextResponse.json({ success: true, message: "Uploaded successfully" });
  } catch (error) {
    console.error("Upload API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
