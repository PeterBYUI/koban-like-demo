import { AuthContext } from "../store/AuthContext";
import { useContext, useRef } from "react";
import { BoardsContext } from "../store/BoardContext";

import Modal from "../components/Modal";
import CardGrid from "../components/CardGrid";
import Card from "../components/Card";
const cards = [
  // {
  //   title: "Ideas",
  //   tasks: ["Find new printer to replace old one"],
  // },
  // {
  //   title: "To-Do",
  //   tasks: [
  //     "Compare CRM software for next year",
  //     "Send invoices and track payments",
  //     "Clean up my CRM or contact list",
  //     "Organize files and digital workspace",
  //   ],
  // },
];

export default function Boards() {
  const { user } = useContext(AuthContext);
  console.log(`userId: ${user?.id || "no user id"}`);

  const { selectedBoard } = useContext(BoardsContext);

  const ref = useRef();

  // const {
  //   data: boards,
  //   isPending,
  //   isError,
  //   error,
  // } = useQuery({
  //   queryKey: ["boards", user?.id],
  //   queryFn: ({ signal }) => {
  //     return getBoards({ userId: user.id });
  //   },
  //   enabled: !!user?.id,
  // });

  return (
    <>
      <Modal ref={ref} />
      {selectedBoard ? (
        <>
          <h2>{selectedBoard}</h2>
          <button onClick={() => ref.current.open()}>Add board</button>
        </>
      ) : (
        <div className="py-24">
          <p className="text-center">
            <button
              onClick={() => ref.current.open()}
              className="text-2xl text-[#fff] hover:text-[#ddd] font-semibold cursor-pointer transition-all duration-200"
            >
              <div className="flex items-center gap-2">
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
                <p>Add a board</p>
              </div>
            </button>
          </p>
        </div>
      )}
      {/* {cards.length > 0 ? (
        <CardGrid>
          {cards.map((card) => (
            <Card key={card.title} card={card} />
          ))}
        </CardGrid>
      ) : (
        <p className="">Add a new board</p>
      )} */}
    </>
  );
}
