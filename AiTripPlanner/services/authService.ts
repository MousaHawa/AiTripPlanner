// services/authService.ts

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  signOut,
} from "firebase/auth";
import { auth } from "./firebase";

export async function signupWithEmail(
  fullName: string,
  email: string,
  password: string
) {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email.trim(),
    password
  );

  if (auth.currentUser) {
    await updateProfile(auth.currentUser, {
      displayName: fullName.trim(),
    });
  }

  return userCredential.user;
}

export async function loginWithEmail(email: string, password: string) {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email.trim(),
    password
  );

  return userCredential.user;
}

export async function resetPassword(email: string) {
  await sendPasswordResetEmail(auth, email.trim());
}

export async function logoutUser() {
  await signOut(auth);
}