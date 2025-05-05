// /app/api/v1/auth/signup/route.js
import { NextResponse } from "next/server";
import { auth, db } from "@/firebase/config";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export async function POST(request) {
  try {
    const { email, password, username } = await request.json();

    if (!email || !password || !username) {
      return NextResponse.json({ success: false, message: "Missing fields" }, { status: 400 });
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await updateProfile(user, { displayName: username });

    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      displayName: username,
      role: "consumer",
      createdAt: serverTimestamp()
    });

    return NextResponse.json({ success: true, message: "User created", uid: user.uid });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
