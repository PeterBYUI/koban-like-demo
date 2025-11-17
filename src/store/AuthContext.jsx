import { createContext, useState } from "react";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/config";

export const AuthContext = createContext({
  user: {
    id: "",
    email: "",
    displayName: "",
  },
  handleSetUser: () => {},
});

export default function AuthContextProvider({ children }) {
  const [user, setUser] = useState(undefined);
  //add loading state to stop the rendering of certains pages before the authentication is completed

  useEffect(() => {
    //checks if the user is logged in
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        let displayName = "";
        if (user.displayName) displayName = user.displayName;
        setUser({
          id: user.uid,
          email: user.email,
          displayName: displayName,
        });
      } else {
        setUser(null); //no user detected
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  function handleSetUser(id, email, displayName) {
    setUser({
      id,
      email,
      displayName,
    });
  }

  const contextValue = {
    user,
    handleSetUser,
  };

  return <AuthContext value={contextValue}>{children}</AuthContext>;
}
