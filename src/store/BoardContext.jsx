import { createContext, useState } from "react";

export const BoardsContext = createContext({
  selectedBoard: {
    id: "",
    title: "",
  },
  handleBoardSelection: () => {},
});

export default function BoardsContextProvider({ children }) {
  const [selectedBoard, setSelectedBoard] = useState(undefined);

  function handleBoardSelection(selectedBoard) {
    console.log("selectedBoard is now ", selectedBoard.title);
    setSelectedBoard((previousValue) => ({
      id: selectedBoard.id,
      title: selectedBoard.title,
    }));
  }

  const contextValue = {
    selectedBoard,
    handleBoardSelection,
  };

  return <BoardsContext value={contextValue}>{children}</BoardsContext>;
}
