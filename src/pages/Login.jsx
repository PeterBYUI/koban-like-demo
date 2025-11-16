import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { signInUser, forgotPassword } from "../util/http";
import { isEmailValid } from "../util/validation";
import { isPasswordValid } from "../util/validation";
import { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../store/AuthContext";
import useSecureInput from "../hooks/useInput";

import SigningButton from "../components/SigningButton";
import Error from "../components/Error";
import CredientialCard from "../components/CredientialCard";
import Input from "../components/Input";
import Dialog from "../components/Dialog";

export default function LoginPage() {
  const navigate = useNavigate();

  const ref = useRef();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: signInUser,
    onSuccess: () => {
      navigate("/boards");
    },
  });

  const { mutate: resetPassword, isError: isResendError } = useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => {
      ref.current.open();
    },
    onError: (err) => {
      console.log(err);
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
  if (isResendError) errors.push("Failed to reset your password");

  const signInOnSubmit = (e) => {
    e.preventDefault();
    mutate({ email, password });
  };

  const { user } = useContext(AuthContext);
  useEffect(() => {
    if (user) {
      navigate("/boards");
    }
  }, [user, navigate]);

  return (
    <>
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
            <button
              onClick={() => resetPassword({ email })}
              type="button"
              className="text-violet-700 disabled:text-violet-200 hover:text-violet-800 cursor-pointer"
              disabled={eDisabled}
            >
              I forgot my password
            </button>
            {errors.length > 0 && <Error errors={errors} />}
          </form>
        </div>
        <div className="bg-violet-700 rounded-b-md lg:rounded-bl-[0] lg:rounded-r-md p-8 flex flex-col items-center justify-center gap-4">
          <h3 className="text-2xl font-semibold text-[#fff] text-center">Don't have an account?</h3>
          <SigningButton onClick={() => navigate("/signup")} title="Sign up" type="white" width="w-3/4" />
        </div>
      </CredientialCard>
      <Dialog ref={ref}>
        <div className="flex flex-col gap-4 items-center">
          <div className="flex flex-col lg:flex-row gap-2 text-violet-700 items-center text-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
              />
            </svg>

            <h3 className="text-xl">Your password has been reset!</h3>
          </div>
          <p className="text-center">
            Please check your emails <em>(including your spam folder)</em> and enter a new password.
          </p>
          <button
            onClick={() => ref.current.close()}
            className="mt-4 text-[#fff] bg-violet-700 hover:bg-violet-800 rounded-md px-2 py-1 cursor-pointer"
          >
            Close
          </button>
        </div>
      </Dialog>
    </>
  );
}
