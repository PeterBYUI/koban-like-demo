import { useDroppable } from "@dnd-kit/core";
import { useRef, useContext, useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { AuthContext } from "../store/AuthContext";
import { BoardsContext } from "../store/BoardContext";
import { getTasks, updateList, deleteList, queryClient } from "../util/http";

import Task from "./Task";
import Modal from "./Modal";
import EditInput from "./EditInput";
import EditButton from "./EditButton";
import DeleteButton from "./DeleteButton";
import Alert from "./Alert";

export default function List({ list }) {
  const ref = useRef();
  const alertRef = useRef();

  const { user } = useContext(AuthContext);
  const { selectedBoard } = useContext(BoardsContext);

  const {
    data: tasks,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["tasks", user?.id, selectedBoard?.id, list.id],
    queryFn: ({ queryKey, signal }) => {
      const [_key, userId, boardId, listId] = queryKey; //[] by index, {} by property name
      return getTasks({ userId, boardId, listId });
    },
    enabled: !!user?.id && !!selectedBoard?.id,
  });

  useEffect(() => {
    if (isError) {
      alertRef.current.open();
    }
  }, [isError]);

  const { setNodeRef } = useDroppable({
    id: list.id,
  });

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

  const { mutate: deletion, isPending: deletionIsPending } = useMutation({
    mutationFn: deleteList,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lists", user?.id, selectedBoard?.id] });
    },
  });

  return (
    <>
      <figure ref={setNodeRef} className="p-6 rounded-md bg-[rgb(245,242,247)] shadow-[0_2px_5px_rgba(0,0,0,.3)]">
        <header className="flex justify-between items-center">
          {!isEditing && <p className="font-semibold text-lg">{list.title}</p>}
          {isEditing && <EditInput newTitle={newListTitle} onChange={handleOnChange} />}
          <div className="flex gap-2 items-center">
            <EditButton
              type="list"
              isEditing={isEditing}
              onClick={() => {
                mutate({ listId: list.id, updates: { title: newListTitle } });
                setIsEditing((previousValue) => !previousValue);
              }}
            />
            <DeleteButton type="list" deletion={() => deletion({ listId: list.id })} />
          </div>
        </header>
        <div className="mt-8">
          {tasks && (
            <ul className="flex flex-col gap-4">
              {tasks.map((task) => {
                return (
                  <li key={task.id}>
                    <Task task={task} listId={list.id} />
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
            <button onClick={() => ref.current.open()} className="flex gap-2 items-center hover:text-violet-700 cursor-pointer">
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
      <Alert ref={alertRef} errorMessage="Failed to fetch tasks. Check your internet connection." />
    </>
  );
}
