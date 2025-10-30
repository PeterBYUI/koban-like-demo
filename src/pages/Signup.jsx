import { Link } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { signUpUser } from "../util/http";
import { useNavigate } from "react-router";
import { useContext } from "react";
import { AuthContext } from "../store/AuthContext";
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

  function signUpOnSubmit(e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    const firstName = fd.get("first-name");
    const lastName = fd.get("last-name");
    const email = fd.get("email"); //use custom hook instead
    const password = fd.get("password"); //use custom hook instead
    mutate({ firstName, lastName, email, password });
  }

  const { enteredData: email, handleUpdateData, setIsBlurred, error: emailError } = useSecureInput((str) => str.includes("@"));

  return (
    <CredientialCard styling="p-8 flex flex-col gap-8">
      <h3 className="text-2xl font-semibold mb-4 text-violet-700 text-center">Tell us a little about yourself</h3>
      <form onSubmit={signUpOnSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 justify-items-center gap-8">
          <Input type="text" name="first-name" placeholder="First name" required />
          <Input type="text" name="last-name" placeholder="Last name" required />
          {/* <Input type="email" name="email" placeholder="Email" required /> */}
          <Input
            type="email"
            name="email"
            value={email}
            onBlur={() => setIsBlurred(true)}
            onChange={handleUpdateData}
            placeholder="Email"
            required
          />
          <Input type="password" name="password" placeholder="Password" required />
        </div>
        <p className="text-center my-8">
          <SigningButton title={isPending ? "Loading..." : "Sign up"} type="violet" width="w-3/4 lg:w-1/4" />
        </p>
        {isError && <Error error={error} />}
        {emailError && <Error error="format/email" />}
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
