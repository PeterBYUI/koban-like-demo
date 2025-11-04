import ProfileIcon from "./ProfileIcon";
import SignOutButton from "./SignOutButton";

export default function Sidebar({ open, mutate, isPending }) {
  let styling =
    "absolute flex pt-16 items-center flex-col gap-16 right-0 w-1/1 h-[calc(100vh-64px)] rounded-bl-md ml-auto bg-[linear-gradient(to_bottom_right,rgba(20,36,82,.9),rgba(20,36,82,.5))] transition-all duration-350 ease-in-out ";
  if (open) {
    styling += "translate-x-[0%]";
  } else {
    styling += "translate-x-[100%]";
  }

  return (
    <div className={styling}>
      <ProfileIcon type="lg" />
      <button
        onClick={mutate}
        className="cursor-pointer text-center text-xl font-semibold text-[#fff] hover:text-[#ddd] transition-all duration-200"
      >
        Sign out
      </button>
      {/* <SignOutButton mutate={mutate} isPending={isPending} /> */}
    </div>
  );
}
