import { useContext, useRef } from "react";
import { AuthContext } from "../store/AuthContext";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { deleteAccount } from "../util/http";

import ProfileIcon from "../components/ProfileIcon";
import Dialog from "../components/Dialog";
import Input from "../components/Input";
import Error from "../components/Error";
import Button from "../components/Button";

export default function Account() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  //query the company name with useQuery
  //enable the query only when we have the user id

  const { mutate, isPending, isError } = useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      navigate("/login");
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const ref = useRef();

  async function onSubmitAccountDeletion(e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    const password = fd.get("password");
    mutate({ id: user?.id, email: user?.email, password });
  }

  return (
    <>
      <section className="p-8">
        <div className="min-h-[calc(90vh-32px)] w-1/1 lg:w-2/3 mx-auto p-8 bg-[rgba(250,250,250,.1)] text-[#fff] rounded-md">
          <Button onClick={() => navigate("/boards")} styling="mb-4 text-[#fff] hover:text-[#ddd]">
            &larr;Go back to Boards
          </Button>
          <h2 className="text-center text-4xl font-semibold">Your Account</h2>
          <div className="mt-24 flex flex-col text-2xl items-center gap-8">
            <ProfileIcon type="xl" />
            <p className="mt-16">{user.displayName}</p>
            <Button onClick={() => ref.current.open()} styling="text-lg text-red-600 hover:text-red-800">
              Delete Account
            </Button>
          </div>
        </div>
      </section>
      <Dialog ref={ref}>
        <form onSubmit={onSubmitAccountDeletion}>
          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-col gap-2 items-center">
              <h3 className="text-red-600 text-2xl font-semibold">Are you sure?</h3>
              <p className="text-red-600 text-xl">This action cannot be undone.</p>
            </div>
            <Input type="password" name="password" id="" placeholder="Enter your password" />
            <Button disabled={isPending} styling="text-lg text-[#fff] bg-red-600 hover:bg-red-800 disabled:bg-red-400 px-2 py-1 rounded-md">
              {isPending ? "Deleting user..." : "Confirm Deletion"}
            </Button>
            {isError && <Error errors={["Please check your password."]} />}
          </div>
        </form>
      </Dialog>
    </>
  );
}
