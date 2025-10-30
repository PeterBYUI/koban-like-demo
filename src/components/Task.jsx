export default function Task({ task }) {
  return (
    <div className="bg-[#fff] shadow-[0_2px_5px_rgba(0,0,0,.3)] rounded-md p-2 text-slate-500 hover:text-slate-800 cursor-pointer">
      {task}
    </div>
  );
}
