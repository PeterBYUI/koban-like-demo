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
        <h2 className="text-right text-xl text-[#fff] mb-8">{title}</h2> {/*Edit the name, delete the list */}
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
