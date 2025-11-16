export default function Button({ styling, children, ...props }) {
  styling += " cursor-pointer transition-all duration-200";

  return (
    <button {...props} className={styling}>
      {children}
    </button>
  );
}
