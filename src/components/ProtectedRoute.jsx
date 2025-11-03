import { AuthContext } from "../store/AuthContext";
import { useContext } from "react";
import { Navigate } from "react-router";

export default function ProtectedRoute({ children }) {
  const { user } = useContext(AuthContext);

  if (user === undefined) {
    return <p>Fetching the user...</p>;
  }

  return user ? children : <Navigate to="/login" />;
}
