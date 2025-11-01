import { Link } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { signUpUser } from "../util/http";
import { useNavigate } from "react-router";
import { useContext } from "react";
import { AuthContext } from "../store/AuthContext";
import { isEmailValid } from "../util/validation";
import { isPasswordValid } from "../util/validation";
import { useRef } from "react";
import useSecureInput from "../hooks/useInput";

import CredientialCard from "../components/CredientialCard";
import Input from "../components/Input";
import SigningButton from "../components/SigningButton";
import Error from "../components/Error";

export default function SignupPage() {
  const navigate = useNavigate();
  const { handleSetUser } = useContext(AuthContext);

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: signUpUser,
    onSuccess: (user) => {
      handleSetUser(user.uid, user.email, user.displayName); //for the profile picture (next step: optimistic updating)
      navigate("/boards");
    },
  });

  const {
    enteredData: firstName,
    handleUpdateData: handleUpdateFirstName,
    setIsBlurred: setFirstNameIsBlurred,
    error: firstNameError,
    disabled: fnDisabled,
  } = useSecureInput((str) => str.length >= 2);

  const {
    enteredData: lastName,
    handleUpdateData: handleUpdateLastName,
    setIsBlurred: setLastNameIsBlurred,
    error: lastNameError,
    disabled: lnDisabled,
  } = useSecureInput((str) => str.length >= 2);

  const { enteredData: email, handleUpdateData, setIsBlurred, error: emailError, disabled: eDisabled } = useSecureInput(isEmailValid);
  const {
    enteredData: password,
    handleUpdateData: handleUpdatePassword,
    isBlurred: passwordIsBlurred,
    setIsBlurred: setPasswordIsBlurred,
    error: passwordError,
    disabled: pDisabled,
  } = useSecureInput(isPasswordValid);

  const {
    enteredData: confirmedPassword,
    handleUpdateData: handleUpdateConfirmedPassword,
    isBlurred: confirmedPasswordIsBlurred,
    setIsBlurred: setConfirmedPasswordIsBlurred,
    error: confirmedPasswordError,
    disabled: cpDisabled,
  } = useSecureInput(isPasswordValid);

  let errors = [];
  if (isError) errors.push(error?.code || "An error has occured");
  if (emailError) errors.push("format/email");
  if (passwordError || confirmedPasswordError) errors.push("format/password");
  if (firstNameError || lastNameError) errors.push("format/name");
  if (confirmedPassword !== password && passwordIsBlurred && confirmedPasswordIsBlurred) errors.push("format/confirm-password");

  function signUpOnSubmit(e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    const firstName = fd.get("first-name");
    const lastName = fd.get("last-name");
    const email = fd.get("email");
    const password = fd.get("password");
    const companyName = fd.get("company-name");
    mutate({ firstName, lastName, email, password, companyName });
  }

  return (
    <CredientialCard styling="p-8 flex flex-col gap-8">
      <h3 className="text-2xl font-semibold mb-4 text-violet-700 text-center">Tell us a little about yourself</h3>
      <form onSubmit={signUpOnSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 justify-items-center gap-8">
          <Input
            type="text"
            value={firstName}
            onChange={handleUpdateFirstName}
            onBlur={setFirstNameIsBlurred}
            name="first-name"
            placeholder="First name"
            required
          />
          <Input
            type="text"
            value={lastName}
            onChange={handleUpdateLastName}
            onBlur={setLastNameIsBlurred}
            name="last-name"
            placeholder="Last name"
            required
          />
          <Input
            type="email"
            name="email"
            value={email}
            onBlur={() => setIsBlurred(true)}
            onChange={handleUpdateData}
            placeholder="Email"
            required
          />
          <Input type="text" name="company-name" placeholder="Company name (optional)" />
          <Input
            type="password"
            value={password}
            onChange={handleUpdatePassword}
            onBlur={() => setPasswordIsBlurred(true)}
            name="password"
            placeholder="Password"
            required
          />

          <Input
            type="password"
            value={confirmedPassword}
            onChange={handleUpdateConfirmedPassword}
            onBlur={() => setConfirmedPasswordIsBlurred(true)}
            name="password"
            placeholder="Confirm password"
            required
          />
        </div>
        <p className="text-center my-8">
          <SigningButton
            title={isPending ? "Loading..." : "Sign up"}
            type="violet"
            width="w-3/4 lg:w-1/4"
            disabled={eDisabled || pDisabled || fnDisabled || lnDisabled || cpDisabled || password !== confirmedPassword}
          />
        </p>
        {errors.length > 0 && <Error errors={errors} />}
      </form>
      <hr className="text-gray-300" />
      <div className="text-center text-lg">
        <p>Already have an account?</p>
        <p className="text-violet-500 hover:text-violet-700">
          <Link to="/login">Log in</Link>
        </p>
      </div>
    </CredientialCard>
  );
}
