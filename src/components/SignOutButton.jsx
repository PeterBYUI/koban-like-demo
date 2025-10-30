export default function SignOutButton({ mutate, isPending }) {
  return (
    <button
      onClick={() => {
        console.log("signing out...");
        mutate();
      }}
      className="text-slate-700 bg-[#fff] hover:bg-[#ddd] cursor-pointer rounded-md px-2 py-1 text-lg transition-all duration-250"
    >
      {isPending ? "Loading..." : "Sign out"}
    </button>
  );
}
