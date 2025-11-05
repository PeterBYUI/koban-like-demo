import { useDraggable } from "@dnd-kit/core";

export default function Task({ task }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  });

  const style = transform
    ? {
        transform: `translate(${transform.x}px, ${transform.y}px)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="bg-[#fff] shadow-[0_2px_5px_rgba(0,0,0,.3)] rounded-md p-2 text-slate-500 hover:text-slate-800 cursor-pointer"
    >
      {task.title}
    </div>
  );
}
