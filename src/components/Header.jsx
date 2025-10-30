import ProfileIcon from "./ProfileIcon";

export default function Header({ setSideBarIsOpen, mutate, isPending }) {
  return (
    <header className="h-16 bg-[linear-gradient(to_bottom_right,rgba(20,36,82,.70),rgba(20,36,82,.05))] flex items-center text-[#fff]">
      <nav className="w-1/1 px-8 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <p className="text-xl font-semibold">Example Board</p>
          <button className="cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
              />
            </svg>
          </button>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <div className="z-[100]">{<ProfileIcon type="md" />}</div>

          <button
            onClick={() => {
              console.log("signing out...");
              mutate();
            }}
            className="text-slate-700 bg-[#fff] hover:bg-[#ddd] cursor-pointer rounded-md px-2 py-1 text-lg transition-all duration-250"
          >
            {isPending ? "Loading..." : "Sign out"}
          </button>
          {/* hidden div*/}
        </div>
        <div className="inline-block md:hidden">
          <button
            onClick={() => setSideBarIsOpen((previousValue) => !previousValue)}
            className="cursor-pointer hover:text-gray-300 transition-all duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
      </nav>
    </header>
  );
}
