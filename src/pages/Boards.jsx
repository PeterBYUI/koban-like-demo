import { useQuery, useMutation } from "@tanstack/react-query";
import { getBoards, addBoard } from "../util/http";
import { AuthContext } from "../store/AuthContext";
import { useContext } from "react";
import { useEffect } from "react";

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
  console.log("Boards component mounted");

  useEffect(() => {
    console.log("Boards mounted");
    return () => console.log("Boards unmounted");
  }, []);

  const { user } = useContext(AuthContext);
  const userId = user.id;

  const {
    data: boards,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["boards", userId],
    queryFn: ({ signal }) => getBoards({ userId }),
  });

  return (
    <>
      <h2>{boards ? boards[0].title : "No boards"}</h2>
      {cards.length > 0 ? (
        <CardGrid>
          {cards.map((card) => (
            <Card key={card.title} card={card} />
          ))}
        </CardGrid>
      ) : (
        <p className="">Add a new board</p>
      )}
    </>
  );
}
