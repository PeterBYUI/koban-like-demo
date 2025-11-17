import { AuthContext } from "../store/AuthContext";
import { useContext } from "react";
import { Navigate } from "react-router";

export default function ProtectedRoute({ children }) {
  const { user } = useContext(AuthContext); //takes time... undefined -> user || undefined -> null (if no user is detected)

  if (user === undefined) {
    return <p>Fetching the user...</p>; //add a spinner
  }
  if (user === null) {
    console.log("No user is logged in");
    return <Navigate to="/login" />;
  }

  return children;
}
