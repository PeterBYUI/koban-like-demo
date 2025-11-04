export default function AddButton({ name, onClick }) {
  return (
    <div className="py-24">
      <p className="text-center">
        <button
          onClick={onClick}
          className="text-2xl text-[#fff] hover:text-[#ddd] font-semibold cursor-pointer transition-all duration-200"
        >
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            <p>Add a {name}</p>
          </div>
        </button>
      </p>
    </div>
  );
}
