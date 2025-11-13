import { useDraggable } from "@dnd-kit/core";
import { useMutation } from "@tanstack/react-query";
import { updateTask, queryClient, deleteTask } from "../util/http";
import { AuthContext } from "../store/AuthContext";
import { BoardsContext } from "../store/BoardContext";
import { useContext, useState, useEffect } from "react";

import TaskButton from "./TaskButton";
import EditInput from "./EditInput";

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
  const [mouseisDown, setMouseIsDown] = useState(false);

  let styling = "bg-[#fff] shadow-[0_2px_5px_rgba(0,0,0,.3)] rounded-md p-2 flex justify-between border-t-4 ";

  if (!mouseisDown) {
    styling += "cursor-grab ";
  } else {
    styling += "cursor-grabbing ";
  }

  if (isChecked) {
    styling += "text-slate-300 hover:text-slate-400 line-through border-t-slate-500";
  } else if (task.isUrgent) {
    styling += "text-slate-500 hover:text-slate-800 border-t-red-400";
  } else {
    styling += "text-slate-500 hover:text-slate-800 border-t-emerald-400";
  }

  useEffect(() => {
    const handleMouseDown = () => setMouseIsDown(true);
    const handleMouseUp = () => setMouseIsDown(false);

    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const [isEditing, setIsEditing] = useState(false);

  const { mutate: editTask } = useMutation({
    mutationFn: updateTask,
    onMutate: async (data) => {},
  });

  function handleUpdatedTaskSubmit() {
    console.log("Submission!!!!");
  }

  return (
    <div ref={setNodeRef} {...attributes} {...listeners} style={style} className={styling}>
      {!isEditing ? (
        <div className="flex gap-2">
          <TaskButton
            buttonType="delete"
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
      ) : (
        <div className="flex gap-4 items-center">
          <input className="bg-slate-200 rounded-md px-1 w-3/5" type="text" name="new-title" defaultValue={task.title} />
          <div className="flex gap-2">
            <input type="checkbox" name="urgent" id="urgent" defaultChecked={task.isUrgent} />
            <label htmlFor="urgent">is urgent</label>
          </div>
        </div>
      )}
      <div className="flex gap-2 items-center">
        <TaskButton
          type={isEditing ? "submit" : "button"}
          buttonType="edit"
          onClick={() => {
            setIsEditing((pv) => !pv);
          }}
          onPointerDown={(e) => e.stopPropagation()}
        >
          {isEditing ? (
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
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
              />
            </svg>
          )}
        </TaskButton>
        {!isEditing && (
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
        )}
      </div>
    </div>
  );
}
