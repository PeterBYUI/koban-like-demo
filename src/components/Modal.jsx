import { useContext } from "react";
import { useMutation } from "@tanstack/react-query";
import { addBoard, addTask, addList } from "../util/http";
import { queryClient } from "../util/http";
import { BoardsContext } from "../store/BoardContext";
import { AuthContext } from "../store/AuthContext";
import { isDocNameValid } from "../util/validation";
import useSecureInput from "../hooks/useInput";

import Dialog from "./Dialog";
import Input from "./Input";
import Error from "./Error";

export default function Modal({ ref, type, listId = null }) {
  const { selectedBoard, handleBoardSelection } = useContext(BoardsContext);
  const { user } = useContext(AuthContext);

  const {
    mutate: mutateAddBoard,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: addBoard,
    onSuccess: (board) => {
      queryClient.invalidateQueries({ queryKey: ["boards", user?.id] });
      ref.current.close();
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
      queryClient.invalidateQueries({ queryKey: ["tasks", user?.id, selectedBoard?.id, listId] });
      ref.current.close();
    },
  });

  const {
    mutate: mutateAddList,
    isPending: isListPending,
    isError: isListError,
    error: listError,
  } = useMutation({
    mutationFn: addList,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["lists", user.id, selectedBoard.id],
      });
      ref.current.close();
    },
  });

  const {
    enteredData: docName,
    resetEnteredData: resetDocName,
    disabled,
    setIsBlurred,
    error: docNameError,
    handleUpdateData: handleUpdateDocName,
  } = useSecureInput(isDocNameValid);

  function handleSubmitBoardName(e) {
    e.preventDefault();
    if (user?.id) {
      // const fd = new FormData(e.target);
      // const title = fd.get("input-name");
      const title = docName;
      if (type === "board") mutateAddBoard({ title, userId: user.id });
      if (type === "list") mutateAddList({ title, userId: user.id, boardId: selectedBoard.id });
      if (type === "task") {
        const fd = new FormData(e.target);
        const isUrgent = fd.get("urgent");
        mutateAddTask({ title, userId: user.id, boardId: selectedBoard.id, listId, isUrgent: isUrgent === "on" });
      }
      resetDocName();
      e.target.reset();
    }
  }

  return (
    <Dialog ref={ref}>
      <h3 className="text-center text-2xl font-semibold text-violet-700 mb-8">Add a new {type}</h3>
      <form onSubmit={handleSubmitBoardName}>
        <div className="flex flex-col items-center gap-6">
          <Input name="input-name" value={docName} onChange={handleUpdateDocName} onBlur={setIsBlurred} />
          {type === "task" && docName && (
            <div className="w-1/1 lg:w-2/3 mx-auto flex gap-4">
              <input type="checkbox" name="urgent" id="urgent" />
              <label htmlFor="urgent">{docName} is urgent</label>
            </div>
          )}
          <div className="flex gap-8">
            <button
              type="button"
              onClick={() => {
                resetDocName();
                ref.current.close();
              }}
              className="text-red-600 hover:text-red-700 cursor-pointer transition-all duration-200"
            >
              Cancel
            </button>
            <button
              disabled={isPending || isListPending || isTaskPending || disabled}
              className="bg-violet-700 hover:bg-violet-900 cursor-pointer px-4 py-1 rounded-md text-[#fff] transition-all duration-200 disabled:bg-violet-200 disabled:text-gray-600"
            >
              {isPending || isTaskPending ? "Loading..." : "Add"}
            </button>
          </div>
          {docNameError && docName && <Error errors={[`Your ${type}'s title must be between 2 and 15 characters long`]} />}
          {/* addind docName here prevents the Error from showing up when the user clicks on cancel,
          which sets isBlurred to true
          */}
        </div>
      </form>
    </Dialog>
  );
}
