import { signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../firebase/config";
import { collection, addDoc, getDocs, query, where, serverTimestamp, orderBy, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient();

const usersRef = collection(db, "users");
const boardsRef = collection(db, "boards");
const listsRef = collection(db, "lists");
const tasksRef = collection(db, "tasks");

//Authentication

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

//Boards

export const addBoard = async ({ title, userId }) => {
  const docRef = await addDoc(boardsRef, {
    createdAt: serverTimestamp(),
    userId,
    title,
    lists: [],
  });

  return {
    id: docRef.id,
    createdAt: serverTimestamp(),
    userId,
    title,
    lists: [],
  };
};

export const getBoards = async ({ userId }) => {
  if (!userId) return [];
  // console.log("Fetching boards...");
  // console.log(`UserId: ${userId}`);
  const queryRef = query(boardsRef, where("userId", "==", userId), orderBy("createdAt", "asc"));
  const snapshot = await getDocs(queryRef);
  const boards = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return boards;
};

//Lists

export const getLists = async ({ userId, selectedBoardId }) => {
  if (!userId || !selectedBoardId) {
    return [];
  }
  const queryRef = query(listsRef, where("userId", "==", userId), where("boardId", "==", selectedBoardId));
  const snapshot = await getDocs(queryRef);
  const lists = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return lists;
};

export const addList = async ({ title, userId, boardId }) => {
  await addDoc(listsRef, {
    createdAt: serverTimestamp(),
    userId,
    boardId,
    title,
  });
};

export const updateList = async ({ listId, updates }) => {
  const targetListRef = doc(db, "lists", listId);
  await updateDoc(targetListRef, updates);
};

export const deleteList = async ({ listId }) => {
  const targetListRef = doc(db, "lists", listId);
  await deleteDoc(targetListRef);
};

//Tasks

export const addTask = async ({ title, userId, boardId, listId }) => {
  if (!title || !userId || !boardId || !listId) return [];

  await addDoc(tasksRef, {
    createdAt: serverTimestamp(),
    title,
    userId,
    boardId,
    listId,
  });
};

export const getTasks = async ({ userId, boardId, listId }) => {
  const queryRef = query(
    tasksRef,
    where("userId", "==", userId),
    where("boardId", "==", boardId),
    where("listId", "==", listId),
    orderBy("createdAt", "asc")
  );

  const snapshot = await getDocs(queryRef);
  const tasks = snapshot.docs.map((task) => ({
    id: task.id,
    ...task.data(),
  }));
  return tasks;
};
