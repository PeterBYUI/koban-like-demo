import { displayNameFormat } from "../util/utility";
import { useContext } from "react";
import { AuthContext } from "../store/AuthContext";
import { useNavigate } from "react-router";

export default function ProfileIcon({ type, closeSidebar }) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  let styling =
    "cursor-pointer text-[rgb(50,55,114)] rounded-[100%] relative before:content-[''] before:bg-[#fff] hover:before:bg-[#ddd] before:absolute before:left-[50%] before:top-[50%] before:translate-x-[-50%] before:translate-y-[-50%] before:z-[-1] before:rounded-[50%] before:transition-all before:duration-200 ";

  if (type === "md") {
    styling += "text-lg before:h-10 before:w-10";
  }
  if (type === "lg") {
    styling += "text-xl before:h-16 before:w-16";
  }
  if (type === "xl") {
    styling += "text-4xl before:h-32 before:w-32";
  }

  return (
    <button
      onClick={() => {
        closeSidebar();
        navigate("/account");
      }}
      className={styling}
    >
      {user.displayName ? displayNameFormat(user.displayName) : "..."}
    </button>
  );
}
