import Task from "./Task";

export default function Card({ card }) {
  return (
    <figure className="p-6 rounded-md bg-[rgb(245,242,247)] shadow-[0_2px_5px_rgba(0,0,0,.3)]">
      <header className="flex justify-between items-center">
        <p className="font-semibold text-lg">{card.title}</p>
        <div className="flex items-center gap-4 text-slate-500">
          <button>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
              <path
                fillRule="evenodd"
                d="M4.755 10.059a7.5 7.5 0 0 1 12.548-3.364l1.903 1.903h-3.183a.75.75 0 1 0 0 1.5h4.992a.75.75 0 0 0 .75-.75V4.356a.75.75 0 0 0-1.5 0v3.18l-1.9-1.9A9 9 0 0 0 3.306 9.67a.75.75 0 1 0 1.45.388Zm15.408 3.352a.75.75 0 0 0-.919.53 7.5 7.5 0 0 1-12.548 3.364l-1.902-1.903h3.183a.75.75 0 0 0 0-1.5H2.984a.75.75 0 0 0-.75.75v4.992a.75.75 0 0 0 1.5 0v-3.18l1.9 1.9a9 9 0 0 0 15.059-4.035.75.75 0 0 0-.53-.918Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <button>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8">
              <path
                fillRule="evenodd"
                d="M4.5 12a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm6 0a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm6 0a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </header>
      <div className="mt-8">
        <ul className="flex flex-col gap-4">
          {card.tasks.map((task) => {
            return (
              <li key={task}>
                <Task task={task} />
              </li>
            );
          })}
        </ul>
      </div>
      <footer className="py-4 text-slate-500">
        <div>
          <button className="flex gap-2 items-center hover:text-slate-700 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
              <path
                fillRule="evenodd"
                d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
                clipRule="evenodd"
              />
            </svg>
            <p className="">Add a card</p>
          </button>
        </div>
      </footer>
    </figure>
  );
}
