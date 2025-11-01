import { signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../firebase/config";
import { collection, addDoc } from "firebase/firestore";
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient();

const collectionRef = collection(db, "users");

//check if the code below is able to handle errors

export const signInUser = async ({ email, password }) => {
  await signInWithEmailAndPassword(auth, email, password);
};

export const signOutUser = async () => {
  await signOut(auth);
};

export const signUpUser = async ({ firstName, lastName, email, password, companyName }) => {
  const res = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(res.user, {
    displayName: `${firstName} ${lastName}`,
  });
  await res.user.reload();
  await addDoc(collectionRef, {
    firstName,
    lastName,
    displayName: `${firstName} ${lastName}`,
    email,
    id: res.user.uid,
    companyName: companyName,
  });
  return res.user; //so that the user can be set manually with the updated displayName property, since updateProfile() doesn't
  //trigger onAuthStateChanged()
};
