import {
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { auth, db } from "../firebase/config";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
  writeBatch,
} from "firebase/firestore";
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

export const forgotPassword = async ({ email }) => {
  await sendPasswordResetEmail(auth, email);
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

export const updateBoard = async ({ boardId, updates }) => {
  const boardRef = doc(db, "boards", boardId);
  await updateDoc(boardRef, updates);
};

export const deleteBatch = async (batch, id) => {
  const listQueryRef = query(listsRef, where("boardId", "==", id));
  const listsSnapshot = await getDocs(listQueryRef);

  listsSnapshot.docs.forEach((listDoc) => {
    batch.delete(listDoc.ref);
  });

  const tasksQueryRef = query(tasksRef, where("boardId", "==", id));
  const tasksSnapshot = await getDocs(tasksQueryRef);

  tasksSnapshot.docs.forEach((taskDoc) => {
    batch.delete(taskDoc.ref);
  });

  const boardDocRef = doc(db, "boards", id);
  batch.delete(boardDocRef);
};

export const deleteBoard = async ({ id }) => {
  const batch = writeBatch(db);
  await deleteBatch(batch, id);
  await batch.commit();
};

//Lists

export const getLists = async ({ userId, selectedBoardId }) => {
  if (!userId || !selectedBoardId) {
    return [];
  }
  const queryRef = query(listsRef, where("userId", "==", userId), where("boardId", "==", selectedBoardId), orderBy("createdAt", "asc"));
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

export const deleteList = async ({ target, id }) => {
  const batch = writeBatch(db);

  const tasksQueryRef = query(tasksRef, where(target, "==", id));
  const tasksSnapshot = await getDocs(tasksQueryRef);

  tasksSnapshot.docs.forEach((taskDoc) => {
    batch.delete(taskDoc.ref);
  });

  const listDocRef = doc(db, "lists", id);

  batch.delete(listDocRef);

  await batch.commit();
};

//Tasks

export const addTask = async ({ title, userId, boardId, listId, isUrgent }) => {
  if (!title || !userId || !boardId || !listId) return [];

  await addDoc(tasksRef, {
    completed: false,
    createdAt: serverTimestamp(),
    title,
    userId,
    boardId,
    listId,
    isUrgent,
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

export const updateTask = async ({ taskId, updates }) => {
  const targetTaskRef = doc(db, "tasks", taskId);
  await updateDoc(targetTaskRef, updates);
};

export const deleteTask = async ({ taskId }) => {
  const targetTaskRef = doc(db, "tasks", taskId);
  await deleteDoc(targetTaskRef);
};

//Account deletion

export const deleteAccount = async ({ id, email, password }) => {
  const user = auth.currentUser;

  const boardQueryRef = query(boardsRef, where("userId", "==", id));
  const boardsSnapshot = await getDocs(boardQueryRef);
  const batch = writeBatch(db);

  for (const boardDoc of boardsSnapshot.docs) {
    await deleteBatch(batch, boardDoc.id);
  }
  await batch.commit();

  const userQueryRef = query(usersRef, where("id", "==", id));
  const userSnapshot = await getDocs(userQueryRef);

  if (userSnapshot) await deleteDoc(userSnapshot.docs[0].ref);

  const credential = EmailAuthProvider.credential(email, password);
  await reauthenticateWithCredential(user, credential);
  await deleteUser(user);
};
