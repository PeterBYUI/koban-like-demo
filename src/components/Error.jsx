export default function Error({ errors }) {
  const errorMessage = {
    "auth/invalid-credential": "Please check your email and your password.",
    "auth/email-already-in-use": "This email is already in use.",
    "format/name": "Your first and last names must be at least 2 characters long.",
    "format/email": "Please enter a valid email.",
    "format/password": "Your password must be at least 6 characters long and contain at least 1 digit.",
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

      <div className="text-center flex flex-col gap-4 lg:gap-2">
        {/* {errors.some((error) => error?.code) && <p>Something went wrong.</p>} */}
        {errors.map((error) => {
          //if the error isn't null – which could happen when a Firebase error is passed as a prop
          if (error) {
            return <p key={error}>{errorMessage[error] ? errorMessage[error] : error}</p>;
          }
        })}
      </div>
    </figure>
  );
}
