import { createContext, useState } from "react";

export const BoardsContext = createContext({
  selectedBoard: "",
  handleBoardSelection: () => {},
});

export default function BoardsContextProvider({ children }) {
  const [selectedBoard, setSelectedBoard] = useState(undefined);

  function handleBoardSelection(board) {
    console.log("selectedBoard is now ", board);
    setSelectedBoard(board);
  }

  const contextValue = {
    selectedBoard,
    handleBoardSelection,
  };

  return <BoardsContext value={contextValue}>{children}</BoardsContext>;
}
