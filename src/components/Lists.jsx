import { DndContext } from "@dnd-kit/core";
import { useRef, useState, useContext, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { updateBoard, queryClient, deleteBoard, updateTask } from "../util/http";
import { AuthContext } from "../store/AuthContext";

import AddButton from "./AddButton";
import List from "./List";
import Modal from "./Modal";
import EditButton from "./EditButton";
import EditInput from "./EditInput";
import DeleteButton from "./DeleteButton";

export default function Lists({ title, boardId, lists }) {
  const ref = useRef();

  const { user } = useContext(AuthContext);

  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  useEffect(() => {
    setNewTitle(title);
  }, [title]);

  function handleOnChange(e) {
    setNewTitle(e.target.value);
  }

  const { mutate } = useMutation({
    mutationFn: updateBoard,
    onMutate: async (data) => {
      const boardId = data.boardId;
      const newTitle = data.updates.title;
      await queryClient.cancelQueries({ queryKey: ["boards", user?.id] });
      const previousBoards = queryClient.getQueryData(["boards", user?.id]);
      const updatedBoards = previousBoards.map((board) => {
        if (board.id === boardId) {
          return {
            ...board,
            title: newTitle,
          };
        } else return board;
      });
      queryClient.setQueryData(["boards", user?.id], updatedBoards);
      return { previousBoards };
    },
    onError: (error, data, context) => {
      queryClient.setQueryData(["boards", user?.id], context.previousBoards);
    },
    onSettled: () => {
      queryClient.invalidateQueries(["boards", user?.id]);
    },
  });

  const { mutate: deletion, isPending } = useMutation({
    mutationFn: deleteBoard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards", user?.id] });
    },
  });

  const { mutate: changeLists } = useMutation({
    mutationFn: updateTask,
    //{taskId, updates: {listId}}
    onMutate: async (data) => {
      const taskId = data.taskId;
      const listId = data.updates.listId;

      await queryClient.cancelQueries({ queryKey: ["tasks"] });

      const previousTasks = queryClient.getQueriesData({ queryKey: ["tasks"] });

      let movedTask = null;
      let oldListKey = null;

      for (const [key, data] of previousTasks) {
        if (!data) continue;

        const task = data.find((task) => task.id === taskId);
        if (task) {
          if (task.listId === listId) return { previousTasks }; //cancels the operation if the list was dragged in the same
          //list it alread belongs to
          movedTask = { ...task, listId };
          oldListKey = key;
          break;
        }
      }

      if (!movedTask || !oldListKey) return { previousTasks };

      const oldKeyData = queryClient.getQueryData(oldListKey || []);
      queryClient.setQueryData(
        oldListKey,
        oldKeyData.filter((task) => task.id !== taskId)
      );

      const newListKey = ["tasks", user?.id, boardId, listId];

      const newListTasks = queryClient.getQueryData(newListKey) || [];
      queryClient.setQueryData(newListKey, [...newListTasks, movedTask]);

      return { previousTasks };
    },
    onError: (error, data, context) => {
      console.log(error);
      queryClient.setQueriesData(["tasks", context.previousTasks]);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  function handleOnDragEnd(e) {
    const { active, over } = e;

    if (over) {
      const newListId = over.id;
      const taskId = active.id;
      changeLists({ taskId, updates: { listId: newListId } });
    }
  }

  if (lists.length > 0) {
    return (
      <>
        <Modal ref={ref} type="list" />
        <div className="flex items-center gap-4 mb-8">
          <div className="text-xl">
            {!isEditing ? (
              <button
                onClick={() => ref.current.open()}
                className="flex gap-2 items-center text-[#fff] font-semibold hover:text-[#ddd] cursor-pointer transition-all duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>

                <p>Add a new list to '{title}'</p>
              </button>
            ) : (
              <EditInput newTitle={newTitle} onChange={handleOnChange} />
            )}
          </div>
          <EditButton
            isEditing={isEditing}
            onClick={() => {
              if (isEditing) {
                mutate({ boardId, updates: { title: newTitle } });
              }
              setIsEditing((previousValue) => !previousValue);
            }}
            type="board"
          />
          <DeleteButton deletion={() => deletion({ id: boardId })} type="board" />
        </div>
        <DndContext onDragEnd={handleOnDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {lists.map((list) => (
              <List key={list.id} list={list} />
            ))}
          </div>
        </DndContext>
      </>
    );
  } else {
    return (
      <>
        <div>
          {!isEditing ? (
            <AddButton name={`list to '${title}'`} onClick={() => ref.current.open()} />
          ) : (
            <div className="pt-24 text-center">
              <EditInput newTitle={newTitle} onChange={handleOnChange} />
            </div>
          )}
          <div className="flex justify-center items-center mt-4 gap-4">
            <EditButton
              type="board"
              isEditing={isEditing}
              onClick={() => {
                if (isEditing) {
                  mutate({ boardId, updates: { title: newTitle } });
                }
                setIsEditing((previousValue) => !previousValue);
              }}
            />
            <DeleteButton type="board" deletion={() => deletion({ boardId })} />
          </div>
        </div>
        <Modal ref={ref} type="list" />
      </>
    );
  }
}
