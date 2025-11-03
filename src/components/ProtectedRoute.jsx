import { AuthContext } from "../store/AuthContext";
import { useContext } from "react";
import { Navigate } from "react-router";

export default function ProtectedRoute({ children }) {
  const { user } = useContext(AuthContext);

  if (user === undefined) {
    console.log("Fetching the user...");
    return <p>Fetching the user...</p>;
  }
  if (user === null) {
    console.log("No user is logged in");
    return <Navigate to="/login" />;
  }

  return children;
}
