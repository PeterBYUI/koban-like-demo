//libraries, utility files, etc,
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router";
import { Navigate } from "react-router";

//pages
import RootPage from "./pages/Root";
import LoginPage from "./pages/Login";
import Boards from "./pages/Boards";
import SignupPage from "./pages/Signup";

import ProtectedRoute from "./components/ProtectedRoute";

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
        element: (
          <ProtectedRoute>
            <Boards />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
