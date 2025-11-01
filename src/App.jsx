//libraries, utility files, etc,
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router";
import { Navigate } from "react-router";
import { useContext } from "react";
import { AuthContext } from "./store/AuthContext";

//pages
import RootPage from "./pages/Root";
import LoginPage from "./pages/Login";
import Boards from "./pages/Boards";
import SignupPage from "./pages/Signup";

function App() {
  const { user } = useContext(AuthContext);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootPage />,
      children: [
        {
          index: true,
          element: <Navigate to="/login" replace />,
        },
        {
          path: "/login",
          element: <LoginPage />,
        },
        {
          path: "/signup",
          element: <SignupPage />,
        },
        {
          path: "/boards",
          element: user ? <Boards /> : <Navigate to="/login" replace />,
        },
      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
