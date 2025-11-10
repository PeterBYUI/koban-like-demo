import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { signOutUser } from "../util/http";

import Header from "./Header";
import Sidebar from "./Sidebar";

export default function TopContent() {
  const navigate = useNavigate();
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: signOutUser,
    onSuccess: () => {
      navigate("/");
    },
  });

  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);

  return (
    <header className="relative">
      <Header setSideBarIsOpen={setSidebarIsOpen} mutate={mutate} isPending={isPending} />
      <Sidebar open={sidebarIsOpen} mutate={mutate} />
    </header>
  );
}
