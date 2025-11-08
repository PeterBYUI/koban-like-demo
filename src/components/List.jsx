import { useDroppable } from "@dnd-kit/core";
import { useRef, useContext, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { AuthContext } from "../store/AuthContext";
import { BoardsContext } from "../store/BoardContext";
import { getTasks, updateList } from "../util/http";
import { queryClient } from "../util/http";

import Task from "./Task";
import Modal from "./Modal";
import Input from "./Input";

export default function List({ list }) {
  const ref = useRef();

  const { user } = useContext(AuthContext);
  const { selectedBoard } = useContext(BoardsContext);

  const {
    data: tasks,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["tasks", user?.id, selectedBoard?.id, list.id],
    queryFn: ({ queryKey, signal }) => {
      const [_key, userId, boardId, listId] = queryKey;
      return getTasks({ userId, boardId, listId });
    },
    enabled: !!user?.id && !!selectedBoard?.id,
  });

  const { setNodeRef } = useDroppable({
    id: list.id,
  });

  if (error) console.error(error);

  const [isEditing, setIsEditing] = useState(false);
  const [newListTitle, setNewListTitle] = useState(list.title);
  const handleOnChange = (e) => {
    setNewListTitle(e.target.value);
  };

  //optimistic updating
  const { mutate } = useMutation({
    mutationFn: updateList,
    onMutate: async (data) => {
      // {listId, updates} => updates = {title: newName}
      const listId = data.listId;
      const newTitle = data.updates.title;
      await queryClient.cancelQueries({ queryKey: ["lists", user?.id, selectedBoard?.id] });
      const previousLists = queryClient.getQueryData(["lists", user?.id, selectedBoard?.id]);
      const updatedLists = previousLists.map((list) => {
        if (list.id === listId) {
          return { ...list, title: newTitle };
        } else return list;
      });
      queryClient.setQueryData(["lists", user?.id, selectedBoard?.id], updatedLists);
      return { previousLists };
    },
    onError: (error, data, context) => {
      queryClient.setQueryData(["lists", user?.id, selectedBoard?.id], context.previousLists);
    },
    onSettled: () => {
      queryClient.invalidateQueries(["lists", user?.id, selectedBoard?.id]);
    },
  });

  return (
    <>
      <figure ref={setNodeRef} className="p-6 rounded-md bg-[rgb(245,242,247)] shadow-[0_2px_5px_rgba(0,0,0,.3)]">
        <header className="flex justify-between items-center">
          {!isEditing && <p className="font-semibold text-lg">{list.title}</p>}
          {isEditing && (
            <input
              type="text"
              value={newListTitle}
              onChange={handleOnChange}
              className="focus:outline-2 focus:outline-violet-700 px-2 py-1 text-lg rounded-md bg-slate-200"
            />
          )}
          <div>
            <button
              onClick={() => {
                mutate({ listId: list.id, updates: { title: newListTitle } });
                setIsEditing((previousValue) => !previousValue);
              }}
              className="text-slate-500 hover:text-slate-700 transition-all duration-200 cursor-pointer"
            >
              {!isEditing && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                  />
                </svg>
              )}
              {isEditing && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              )}
            </button>
          </div>
        </header>
        <div className="mt-8">
          {tasks && (
            <ul className="flex flex-col gap-4">
              {tasks.map((task) => {
                return (
                  <li key={task.id}>
                    <Task task={task} />
                  </li>
                );
              })}
            </ul>
          )}
          {!isPending && !tasks && <p>This list is currently empty.</p>}
          {isPending && <p>Fetching the tasks...</p>}
        </div>
        <footer className="py-4 text-slate-500">
          <div>
            <button onClick={() => ref.current.open()} className="flex gap-2 items-center hover:text-slate-700 cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                <path
                  fillRule="evenodd"
                  d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="">Add a task</p>
            </button>
          </div>
        </footer>
      </figure>
      <Modal ref={ref} type="task" listId={list.id} />
    </>
  );
}
