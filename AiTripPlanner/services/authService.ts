import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  signOut,
} from "firebase/auth";

import { doc, setDoc, serverTimestamp } from "firebase/firestore";

import { auth, db } from "./firebase";

export async function signupWithEmail(
  firstName: string,
  lastName: string,
  email: string,
  password: string
) {
  const cleanFirstName = firstName.trim();
  const cleanLastName = lastName.trim();
  const cleanEmail = email.trim().toLowerCase();

  const userCredential = await createUserWithEmailAndPassword(
    auth,
    cleanEmail,
    password
  );

  const user = userCredential.user;

  await updateProfile(user, {
    displayName: `${cleanFirstName} ${cleanLastName}`,
  });

  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    firstName: cleanFirstName,
    lastName: cleanLastName,
    email: cleanEmail,
    createdAt: serverTimestamp(),
  });

  return user;
}

export async function loginWithEmail(email: string, password: string) {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email.trim().toLowerCase(),
    password
  );

  return userCredential.user;
}

export async function resetPassword(email: string) {
  await sendPasswordResetEmail(auth, email.trim().toLowerCase());
}

export async function logoutUser() {
  await signOut(auth);
}