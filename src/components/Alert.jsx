import Dialog from "./Dialog";
import Error from "./Error";

export default function Alert({ ref, errorMessage }) {
  return (
    <Dialog ref={ref}>
      <header className="text-center text-violet-700 font-semibold">
        <h3 className="text-xl mb-4">Let's try this again!</h3>
      </header>
      <Error errors={[errorMessage]} />
      <p className="text-center mt-8">
        <button
          onClick={() => ref.current.close()}
          className="bg-red-400 hover:bg-red-500 cursor-pointer rounded-md cursor-pointer px-2 py-1 text-[#fff]"
        >
          Close
        </button>
      </p>
    </Dialog>
  );
}
