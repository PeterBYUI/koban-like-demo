import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { signInUser } from "../util/http";
import { isEmailValid } from "../util/validation";
import { isPasswordValid } from "../util/validation";
import useSecureInput from "../hooks/useInput";

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

  const {
    enteredData: email,
    handleUpdateData: handleUpdateEmail,
    setIsBlurred: setEmailIsBlurred,
    error: emailError,
    disabled: eDisabled,
  } = useSecureInput(isEmailValid);

  const {
    enteredData: password,
    handleUpdateData: handleUpdatePassword,
    setIsBlurred: setPasswordIsBlurred,
    error: passwordError,
    disabled: pDisabled,
  } = useSecureInput(isPasswordValid);

  let errors = [];
  if (isError) errors.push(error?.code || "An error occured.");
  if (emailError) errors.push("format/email");
  if (passwordError) errors.push("format/password");

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
          <Input
            type="email"
            value={email}
            onChange={handleUpdateEmail}
            onBlur={setEmailIsBlurred}
            name="email"
            placeholder="Email"
            required
          />
          <Input
            type="password"
            value={password}
            onChange={handleUpdatePassword}
            onBlur={setPasswordIsBlurred}
            name="password"
            placeholder="Password"
            required
          />
          <SigningButton
            title={isPending ? "Loading..." : "Log in"}
            type="violet"
            width="w-3/4 lg:w-1/4"
            disabled={eDisabled || pDisabled || isPending}
          />
          {errors.length > 0 && <Error errors={errors} />}
        </form>
      </div>
      <div className="bg-violet-700 rounded-b-md lg:rounded-r-md p-8 flex flex-col items-center justify-center gap-4">
        <h3 className="text-2xl font-semibold text-[#fff] text-center">Don't have an account?</h3>
        <SigningButton onClick={() => navigate("/signup")} title="Sign up" type="white" width="w-3/4" />
      </div>
    </CredientialCard>
  );
}
