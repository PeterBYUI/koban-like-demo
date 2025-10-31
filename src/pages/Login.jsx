import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { signInUser, queryClient } from "../util/http";

import SigningButton from "../components/SigningButton";
import Error from "../components/Error";
import CredientialCard from "../components/CredientialCard";
import Input from "../components/Input";

export default function LoginPage() {
  const navigate = useNavigate();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: signInUser,
    onSuccess: () => {
      navigate("/boards");
    },
  });

  const signInOnSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const email = fd.get("email"); //replace with custom hooks to check the validity of the email
    const password = fd.get("password"); //replace with custom hooks to check the validity of the password
    mutate({ email, password });
  };

  return (
    <CredientialCard styling="grid grid-cols-1 lg:grid-cols-[2fr_1fr]">
      <div className="flex flex-col items-center gap-4 p-8">
        <h3 className="text-2xl font-semibold mb-4 text-violet-700 text-center">Login To Your Account</h3>
        <form onSubmit={signInOnSubmit} className="w-1/1 flex flex-col items-center gap-4">
          <Input type="email" name="email" placeholder="Email" required />
          <Input type="password" name="password" placeholder="Password" required />
          <SigningButton title={isPending ? "Loading..." : "Log in"} type="violet" width="w-3/4 lg:w-1/4" />
          {isError && <Error errors={[error?.code || "An error has occured."]} />}
        </form>
      </div>
      <div className="bg-violet-700 rounded-b-md lg:rounded-r-md p-8 flex flex-col items-center justify-center gap-4">
        <h3 className="text-2xl font-semibold text-[#fff] text-center">Don't have an account?</h3>
        <SigningButton onClick={() => navigate("/signup")} title="Sign up" type="white" width="w-3/4" />
      </div>
    </CredientialCard>
  );
}
