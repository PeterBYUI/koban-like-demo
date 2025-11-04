import { signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../firebase/config";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient();

const usersRef = collection(db, "users");
const boardsRef = collection(db, "boards");
const listsRef = collection(db, "lists");

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
  await addDoc(usersRef, {
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

export const addBoard = async ({ title, userId }) => {
  const docRef = await addDoc(boardsRef, {
    userId,
    title,
    lists: [],
  });

  return {
    id: docRef.id,
    userId,
    title,
    lists: [],
  };
};

export const getBoards = async ({ userId }) => {
  if (!userId) return [];
  console.log("Fetching boards...");
  console.log(`UserId: ${userId}`);
  const queryRef = query(boardsRef, where("userId", "==", userId));
  const snapshot = await getDocs(queryRef);
  const boards = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return boards;
};

export const getLists = async ({ userId, selectedBoardId }) => {
  if (!userId || !selectedBoardId) return [];
  // const queryRef = query(listsRef, where("userId", "==", userId), where("boardId", "==", selectedBoardId));
  const snapshot = await getDocs(listsRef);
  const lists = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return lists;
};

export const addList = async ({ userId, boardId }) => {};
