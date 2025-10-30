export default function Error({ error }) {
  const errorMessage = {
    "auth/invalid-credential": "Please check your email and your password.",
    "format/email": "Please enter a valid email.",
  };

  return (
    <figure className="px-8 py-2 mx-auto bg-red-200 rounded-md w-3/3 lg:w-2/3 flex flex-col gap-2 items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="text-red-400 size-8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
        />
      </svg>

      <div className="text-center">
        {error?.code && <p>Something went wrong.</p>}
        {error?.code ? <p>{errorMessage[error?.code] || "Please try again."}</p> : <p>{errorMessage[error]}</p>}
      </div>
    </figure>
  );
}
