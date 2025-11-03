import { useImperativeHandle, useRef, useContext } from "react";
import { useMutation } from "@tanstack/react-query";
import { addBoard } from "../util/http";
import { queryClient } from "../util/http";
import { BoardsContext } from "../store/BoardContext";
import { AuthContext } from "../store/AuthContext";

import Input from "./Input";

export default function Modal({ ref }) {
  const internalRef = useRef();

  const { handleBoardSelection } = useContext(BoardsContext);
  const { user } = useContext(AuthContext);

  useImperativeHandle(ref, () => {
    return {
      open() {
        internalRef.current.showModal();
      },
    };
  });

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: addBoard,
    onSuccess: (board) => {
      console.log("Successfully submitted a new board");
      queryClient.invalidateQueries({ queryKey: ["boards", user?.id] });
      handleBoardSelection(board.title);
    },
    onError: (err) => {
      console.error(err);
    },
  });

  function handleSubmitBoardName(e) {
    e.preventDefault();
    if (user?.id) {
      console.log("We have a user, we can now submit a board!");
      const fd = new FormData(e.target);
      const title = fd.get("board-name");
      mutate({ title, userId: user.id });
      internalRef.current.close();
    }
  }

  return (
    <dialog
      ref={internalRef}
      className="bg-[#e6e6fa] mt-16 w-2/3 lg:w-1/3 mx-auto p-8 rounded-md backdrop:bg-slate-950 backdrop:opacity-25"
    >
      <h3 className="text-center text-2xl font-semibold text-violet-700 mb-8">Add a new modal</h3>
      <form onSubmit={handleSubmitBoardName}>
        <div className="flex flex-col items-center gap-4">
          <Input name="board-name" />
          <button className="bg-violet-700 hover:bg-violet-900 cursor-pointer px-4 py-1 rounded-md text-[#fff] transition-all duration-200">
            Add
          </button>
        </div>
      </form>
    </dialog>
  );
}
