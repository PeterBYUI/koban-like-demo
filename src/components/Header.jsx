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
  });

  useEffect(() => {
    //onSuccess is deprecated in Tanstack v5
    if (isSuccess) {
      console.log("Successfully retrieved the boards: ", boards);
      handleBoardSelection(boards[0]); //will be undefined if there are no boards on the server
    }
  }, [isSuccess, boards]);

  const [selectValue, setSelectValue] = useState(boards ? { id: boards[0].id, title: boards[0].title, lists: boards[0].lists } : ""); //a ref could be used instead

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
                  value={selectValue.title}
                  onChange={(e) => {
                    const boardName = e.target.value;
                    const selectedBoard = boards.find((board) => board.title === boardName);
                    handleBoardSelection(selectedBoard);
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
