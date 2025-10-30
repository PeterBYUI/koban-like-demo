export default function SigningButton({ title, type, width, ...props }) {
  let styling = "mt-4 px-4 py-2 cursor-pointer rounded-2xl font-semibold shadow-[0_5px_10px_rgba(0,0,0,.3)] transition-all duration-200 ";

  if (type === "violet") {
    styling += "bg-violet-700 hover:bg-violet-900 text-[#fff] ";
  }
  if (type === "white") {
    styling += "bg-[#fff] hover:bg-gray-200 text-violet-700 ";
  }

  styling += width;

  return (
    <button {...props} className={styling}>
      {title}
    </button>
  );
}
