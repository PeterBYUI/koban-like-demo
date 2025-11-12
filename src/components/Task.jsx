import { useDraggable } from "@dnd-kit/core";
import { useMutation } from "@tanstack/react-query";
import { updateTask, queryClient } from "../util/http";
import { AuthContext } from "../store/AuthContext";
import { BoardsContext } from "../store/BoardContext";
import { useContext, useState } from "react";

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

  const [isChecked, setIsChecked] = useState(task.completed);

  let styling = "bg-[#fff] shadow-[0_2px_5px_rgba(0,0,0,.3)] rounded-md p-2  cursor-pointer flex justify-between border-t-4 ";

  if (isChecked) {
    styling += "text-slate-300 hover:text-slate-400 line-through border-t-slate-500";
  } else {
    styling += "text-slate-500 hover:text-slate-800 border-t-emerald-400";
  }

  return (
    <div ref={setNodeRef} {...attributes} {...listeners} style={style} className={styling}>
      {task.title}
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
