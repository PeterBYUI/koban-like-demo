import { DndContext } from "@dnd-kit/core";
import { useRef } from "react";

import AddButton from "./AddButton";
import List from "./List";
import Modal from "./Modal";

export default function Lists({ title, lists }) {
  const ref = useRef();

  function handleOnDragEnd(e) {
    const { active, over } = e;

    console.log(active.id);

    if (over) {
      console.log(over.id);
    }
  }

  if (lists.length > 0) {
    return (
      <>
        <Modal ref={ref} type="list" />
        <h2 className="text-xl text-[#fff] mb-8">
          <button
            onClick={() => ref.current.open()}
            className="flex gap-2 items-center font-semibold hover:text-[#ddd] cursor-pointer transition-all duration-200"
          >
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

            <p>Add a new list to '{title}'</p>
          </button>
        </h2>{" "}
        {/*Edit the name, delete the list */}
        <DndContext onDragEnd={handleOnDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {lists.map((list) => (
              <List key={list.id} list={list} />
            ))}
          </div>
        </DndContext>
      </>
    );
  } else {
    return (
      <>
        <AddButton name={`list to '${title}'`} onClick={() => ref.current.open()} />
        <Modal ref={ref} type="list" />
      </>
    );
  }
}
