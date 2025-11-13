import { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "../store/AuthContext";
import { BoardsContext } from "../store/BoardContext";
import { useQuery } from "@tanstack/react-query";
import { getBoards } from "../util/http";
// import { capitalize } from "../util/utility";

import ProfileIcon from "./ProfileIcon";
import Modal from "./Modal";

export default function Header({ setSideBarIsOpen, mutate, isPending }) {
  const { user } = useContext(AuthContext);
  const { selectedBoard, handleBoardSelection } = useContext(BoardsContext);

  const {
    data: boards,
    isPending: isBoardsPending,
    isSuccess,
    isError,
    error,
  } = useQuery({
    queryKey: ["boards", user?.id],
    queryFn: ({ queryKey, signal }) => {
      const [_key, userId] = queryKey;

      return getBoards({ userId });
    },
    enabled: !!user?.id,
    refetchOnWindowFocus: false, //flag to prevent useEffect from switching the tab back to length - 1?
  });

  const [selectValue, setSelectValue] = useState(selectedBoard ? selectedBoard?.title : "");

  const previousBoardsLength = useRef(0);

  useEffect(() => {
    //onSuccess is deprecated in Tanstack v5
    if (!isSuccess || !boards) return;

    //checks if the board that was active before the update still exists
    const activeBoard = boards.find((board) => board.id === selectedBoard?.id);

    //if the new length is greater, this means a new board was added
    if (boards.length > previousBoardsLength.current) {
      //in which case we display the newest board
      handleBoardSelection(boards?.[boards?.length - 1]);
    } else if (activeBoard) {
      //if the titles do not match, this means boards changed because the user updated the name of the active board
      if (activeBoard.title !== selectedBoard?.title) {
        //we update the context to make sure it reflects the newest version of the active board
        handleBoardSelection(activeBoard);
      }
    } else {
      //if the activeBoard returns false, then this means the active board was deleted
      if (boards.length <= 0) {
        //if it was the last board of the list, then we set selectedBoard to undefined as the user ran out of boards
        handleBoardSelection(undefined);
      } else {
        //however, if there are still boards in the list, we want to display the most recent one
        handleBoardSelection(boards?.[boards?.length - 1]);
      }
    }
    previousBoardsLength.current = boards?.length ?? 0;
  }, [isSuccess, boards, selectedBoard]);

  useEffect(() => {
    //when the first useEffect hook updates the context, this hook will run (due to selectedBoard being in the dependency array)
    //first, it will retrieve the current board (activeBoard in the above hook represents the board the user was working
    //on before the update; whereas here it represents the newly active board that shows up as a result of the update
    const newlyActiveBoard = boards?.find((board) => board.id === selectedBoard?.id);
    if (newlyActiveBoard) {
      //if there is indeed such a newly active board, we set the select value to its title
      setSelectValue(newlyActiveBoard.title);
    } else {
      if (boards?.length > 0) {
        //otherwise, we retrieve the name of the latest board (consistent with the above-mentioned logic)
        setSelectValue(boards[boards.length - 1].title);
      } else setSelectValue(""); //if there are no boards remaining, selectedBoard will be undefined
      //so we set the select value to an empty string (No Boards (Yet) will be displayed instead)
    }
  }, [boards, selectedBoard]);

  const ref = useRef();

  return (
    <>
      <Modal ref={ref} type="board" />
      <header className="h-16 bg-[linear-gradient(to_bottom_right,rgba(20,36,82,.70),rgba(20,36,82,.05))] flex items-center text-[#fff]">
        <nav className="w-1/1 px-8 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <p className="text-xl font-semibold">
              {boards?.[0]?.title !== undefined ? (
                <select
                  name="board"
                  id="board"
                  value={selectValue}
                  onChange={(e) => {
                    const boardName = e.target.value;
                    const selectedBoard = boards?.find((board) => board.title === boardName);
                    handleBoardSelection(selectedBoard);
                    setSelectValue(e.target.value);
                  }}
                >
                  {boards.map((board) => (
                    <option key={board.title} value={board.title}>
                      {board.title}
                    </option>
                  ))}
                </select>
              ) : (
                "No boards (yet)."
              )}
            </p>
            <button onClick={() => ref.current.open()} className="cursor-pointer hover:text-[#ddd] transition-all duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                <path
                  fillRule="evenodd"
                  d="M19.5 21a3 3 0 0 0 3-3V9a3 3 0 0 0-3-3h-5.379a.75.75 0 0 1-.53-.22L11.47 3.66A2.25 2.25 0 0 0 9.879 3H4.5a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h15Zm-6.75-10.5a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25v2.25a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V10.5Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <div className="z-[100]">{<ProfileIcon type="md" />}</div>

            <button
              onClick={() => {
                console.log("signing out...");
                mutate();
              }}
              className="text-slate-700 bg-[#fff] hover:bg-[#ddd] cursor-pointer rounded-md px-2 py-1 text-lg transition-all duration-250"
            >
              {isPending ? "Loading..." : "Sign out"}
            </button>
            {/* hidden div*/}
          </div>
          <div className="inline-block md:hidden">
            <button
              onClick={() => setSideBarIsOpen((previousValue) => !previousValue)}
              className="cursor-pointer hover:text-gray-300 transition-all duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          </div>
        </nav>
      </header>
    </>
  );
}
