export default function SigningButton({ title, type, width, disabled, ...props }) {
  let styling = "mt-4 px-4 py-2 rounded-2xl font-semibold shadow-[0_5px_10px_rgba(0,0,0,.3)] transition-all duration-200 ";

  if (!disabled && type === "violet") {
    styling += "cursor-pointer bg-violet-700 hover:bg-violet-900 text-[#fff] ";
  }
  if (!disabled && type === "white") {
    styling += "cursor-pointer bg-[#fff] hover:bg-gray-200 text-violet-700 ";
  }
  if (disabled) {
    styling += "disabled:bg-violet-200 disabled:text-gray-600 ";
  }

  styling += width;

  return (
    <button {...props} className={styling} disabled={disabled}>
      {title}
    </button>
  );
}
