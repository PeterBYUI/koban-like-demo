import { useDroppable } from "@dnd-kit/core";
import { useRef, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../store/AuthContext";
import { BoardsContext } from "../store/BoardContext";
import { getTasks } from "../util/http";

import Task from "./Task";
import Modal from "./Modal";

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
  return (
    <>
      <figure ref={setNodeRef} className="p-6 rounded-md bg-[rgb(245,242,247)] shadow-[0_2px_5px_rgba(0,0,0,.3)]">
        <header className="flex justify-between items-center">
          <p className="font-semibold text-lg">{list.name}</p>
          <button>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8">
              <path
                fillRule="evenodd"
                d="M4.5 12a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm6 0a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm6 0a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
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
              <p className="">Add a card</p>
            </button>
          </div>
        </footer>
      </figure>
      <Modal ref={ref} type="task" listId={list.id} />
    </>
  );
}
