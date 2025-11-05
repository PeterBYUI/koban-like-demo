import { useImperativeHandle, useRef, useContext, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { addBoard, addTask } from "../util/http";
import { queryClient } from "../util/http";
import { BoardsContext } from "../store/BoardContext";
import { AuthContext } from "../store/AuthContext";

import Input from "./Input";

export default function Modal({ ref, type, listId = null }) {
  //boards || lists
  const internalRef = useRef();

  const { selectedBoard, handleBoardSelection } = useContext(BoardsContext);
  const { user } = useContext(AuthContext);

  useImperativeHandle(ref, () => {
    return {
      open() {
        internalRef.current.showModal();
      },
    };
  });

  const {
    mutate: mutateAddBoard,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: addBoard,
    onSuccess: (board) => {
      console.log("Successfully submitted a new board");
      queryClient.invalidateQueries({ queryKey: ["boards", user?.id] });
      handleBoardSelection(board.title);
      internalRef.current.close();
    },
    onError: (err) => {
      console.error(err);
    },
  });

  const {
    mutate: mutateAddTask,
    isPending: isTaskPending,
    isError: isTaskError,
    error: taskError,
  } = useMutation({
    mutationFn: addTask,
    onSuccess: () => {
      internalRef.current.close();
    },
  });

  function handleSubmitBoardName(e) {
    e.preventDefault();
    if (user?.id) {
      const fd = new FormData(e.target);
      const title = fd.get("input-name");
      if (type === "board") mutateAddBoard({ title, userId: user.id });
      //if (type === "list")
      if (type === "task") mutateAddTask({ title, userId: user.id, boardId: selectedBoard.id, listId });
    }
  }

  return (
    <dialog
      ref={internalRef}
      className="bg-[#e6e6fa] mt-16 w-2/3 lg:w-1/3 mx-auto p-8 rounded-md backdrop:bg-slate-950 backdrop:opacity-25"
    >
      <h3 className="text-center text-2xl font-semibold text-violet-700 mb-8">Add a new {type}</h3>
      <form onSubmit={handleSubmitBoardName}>
        <div className="flex flex-col items-center gap-6">
          <Input name="input-name" />
          <div className="flex gap-8">
            <button
              type="button"
              onClick={() => internalRef.current.close()}
              className="text-red-600 hover:text-red-700 cursor-pointer transition-all duration-200"
            >
              Cancel
            </button>
            <button className="bg-violet-700 hover:bg-violet-900 cursor-pointer px-4 py-1 rounded-md text-[#fff] transition-all duration-200">
              {isPending || isTaskPending ? "Loading..." : "Add"}
            </button>
          </div>
        </div>
      </form>
    </dialog>
  );
}
