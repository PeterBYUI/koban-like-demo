export default function EditInput({ newTitle, onChange }) {
  return (
    <input
      type="text"
      value={newTitle}
      onChange={onChange}
      className="focus:outline-2 focus:outline-violet-700 px-2 py-1 text-lg rounded-md bg-slate-200"
    />
  );
}
