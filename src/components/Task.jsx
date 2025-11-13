import { useDraggable } from "@dnd-kit/core";
import { useMutation } from "@tanstack/react-query";
import { updateTask, queryClient, deleteTask } from "../util/http";
import { AuthContext } from "../store/AuthContext";
import { BoardsContext } from "../store/BoardContext";
import { useContext, useState } from "react";

import TaskButton from "./TaskButton";

export default function Task({ task, listId }) {
  const { user } = useContext(AuthContext);
  const { selectedBoard } = useContext(BoardsContext);

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  });

  const style = transform
    ? {
        transform: `translate(${transform.x}px, ${transform.y}px)`,
      }
    : undefined;

  const { mutate } = useMutation({
    mutationFn: updateTask,
    onMutate: async (data) => {
      const taskId = data.taskId;
      const completionState = data.updates.completed;
      await queryClient.invalidateQueries({ queryKey: ["tasks", user?.id, selectedBoard?.id, listId] });

      const previousTasks = queryClient.getQueryData(["tasks", user?.id, selectedBoard?.id, listId]);

      const newTasks = previousTasks.map((task) => {
        if (task.id === taskId) {
          return { ...task, completed: completionState };
        } else return task;
      });

      queryClient.setQueryData(["tasks", user?.id, selectedBoard?.id, listId], newTasks);

      return { previousTasks };
    },
    onError: (error, data, context) => {
      console.log(error);
      queryClient.setQueryData(["tasks", user?.id, selectedBoard?.id, listId], context.previousTasks);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", user?.id, selectedBoard?.id, listId] });
    },
  });

  const {
    mutate: delTask,
    isPending: isDeletionPending,
    isError,
    error,
    isSuccess,
  } = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks", user?.id, selectedBoard?.id, listId]);
    },
  });

  const [isChecked, setIsChecked] = useState(task.completed);

  let styling = "bg-[#fff] shadow-[0_2px_5px_rgba(0,0,0,.3)] rounded-md p-2  cursor-pointer flex justify-between border-t-4 ";

  if (isChecked) {
    styling += "text-slate-300 hover:text-slate-400 line-through border-t-slate-500";
  } else {
    styling += "text-slate-500 hover:text-slate-800 border-t-emerald-400";
  }

  return (
    <div ref={setNodeRef} {...attributes} {...listeners} style={style} className={styling}>
      <div className="flex gap-2">
        <TaskButton
          type="delete"
          onClick={() => {
            console.log("about to delete the task");
            delTask({ taskId: task.id });
          }}
          isPending={isDeletionPending}
          isSuccess={isSuccess}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </TaskButton>
        <p>{task.title}</p>
      </div>
      <input
        onPointerDown={(e) => e.stopPropagation()} //to prevent dnd kit from capturing the event
        type="checkbox"
        name="completed"
        checked={isChecked}
        onChange={(e) => {
          setIsChecked((pv) => !pv);
          mutate({ taskId: task.id, updates: { completed: !isChecked } });
        }}
      />
    </div>
  );
}
