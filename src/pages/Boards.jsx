import { AuthContext } from "../store/AuthContext";
import { useContext, useRef } from "react";
import { BoardsContext } from "../store/BoardContext";

import Lists from "../components/Lists";
import Modal from "../components/Modal";
import AddButton from "../components/AddButton";

//import useqQuery and enable the query only when we have a selectedBoard. Fetch the lists using the board's id.
//invalidate the query in the select's onChange prop.

export default function Boards() {
  const { user } = useContext(AuthContext);
  console.log(`userId: ${user?.id || "no user id"}`);

  const { selectedBoard } = useContext(BoardsContext);

  const ref = useRef();

  return (
    <>
      {selectedBoard ? (
        <div className="p-8">
          <div className="min-h-[calc(90vh-32px)] w-1/1 p-8 bg-[rgba(250,250,250,.1)] rounded-md">
            <Lists title={selectedBoard.title} lists={selectedBoard.lists} />
          </div>
        </div>
      ) : (
        <AddButton name="board" onClick={() => ref.current.open()} />
      )}
      <Modal ref={ref} />
    </>
  );
}
