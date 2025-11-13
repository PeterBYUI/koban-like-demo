export default function TaskButton({ buttonType, isPending, isSuccess, children, ...props }) {
  let buttonStyle = " ";

  const disabled = isPending || isSuccess;
  //the signing button didn't need isSuccess since the user navigates away from the login page once the mutation is over
  ///TaskButton will stay on screen for a few milliseconds while React re-renders its parent element

  if (buttonType === "delete" && !disabled) {
    buttonStyle += "hover:text-red-400 cursor-pointer";
  } else if (buttonType === "edit" && !disabled) {
    buttonStyle += "hover:text-violet-700 cursor-pointer";
  } else if (disabled) {
    buttonStyle = "cursor-not-allowed";
  }

  // className={isPending || isSuccess ? "cursor-not-allowed" : "hover:text-red-400 cursor-pointe"}

  return (
    <button className={buttonStyle} {...props} disabled={disabled}>
      {children}
    </button>
  );
}
