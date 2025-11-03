import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./fonts.css";
import App from "./App.jsx";
import AuthContextProvider from "./store/AuthContext.jsx";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./util/http.js";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <QueryClientProvider client={queryClient}>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  </QueryClientProvider>
  // </StrictMode>
);
