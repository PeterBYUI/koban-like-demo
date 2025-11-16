import { Outlet } from "react-router";
import { AuthContext } from "../store/AuthContext";
import { useContext } from "react";

import TopContent from "../components/TopContent";

export default function RootPage() {
  const { user } = useContext(AuthContext);

  return (
    <>
      {user && <TopContent />} {/*to avoid re-rendering the entire app every time the user opens the sidebar*/}
      {!user && (
        <h1 className="text-5xl text-[#fff] font-semibold text-center mt-16 text-shadow-[0_5px_10px_rgba(0,0,0,.3)]">Koban Demo app</h1>
      )}
      <main>
        <Outlet />
      </main>
    </>
  );
}
