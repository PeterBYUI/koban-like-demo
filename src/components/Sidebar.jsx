import ProfileIcon from "./ProfileIcon";
import Button from "./Button";

export default function Sidebar({ open, mutate, closeSideBar }) {
  let styling =
    "absolute flex pt-16 items-center flex-col gap-16 right-0 w-1/1 h-[calc(100vh-64px)] rounded-bl-md ml-auto bg-[linear-gradient(to_bottom_right,rgba(20,36,82,.9),rgba(20,36,82,.5))] transition-all duration-350 ease-in-out ";
  if (open) {
    styling += "translate-x-[0%]";
  } else {
    styling += "translate-x-[100%]";
  }

  return (
    <div className={styling}>
      <ProfileIcon type="lg" closeSideBar={closeSideBar} />
      <Button onClick={mutate} styling="text-center text-xl font-semibold text-[#fff] hover:text-[#ddd]">
        Sign out
      </Button>
      {/* <SignOutButton mutate={mutate} isPending={isPending} /> */}
    </div>
  );
}
