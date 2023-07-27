"use client";

import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { spaceId } from "@/utils/constants";
import { generateId } from "@/utils/generateId";
import { getCookie } from "cookies-next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SingupPage2() {
  const router = useRouter();
  const [user, setUser] = useState("");

  useEffect(() => {
    if (getCookie("userId")) {
      // router.push("/");
    }
  }, []);

  // Spaces are a user’s different areas of concern. For example, a user might have a space for a personal to-do list and a space for a shared to-do list
  // const spaceId1 = generateId();

  return (
    <>
      <h2 className="text-4xl  my-5">Sign Up</h2>
      <form
        className=""
        onSubmit={(e) => {
          e.preventDefault();
          console.log("calling");
          (async function () {
            fetch(`/api/auth/signup`, {
              method: "POST",
              headers: {
                "Content-Type": "appliation/json",
                Accept: "application/json",
              },
              body: JSON.stringify({
                userId: `${user}`,
              }),
            })
              .then((r) => r.json())
              .then((r) => {
                console.log(r);

                if (!r.spaceId) return;
                window.localStorage.setItem("spaceId1", r.spaceId);
                router.push("/");
              });
          })();
        }}
      >
        <Input
          placeholder="username"
          type="text"
          value={user}
          onChange={({ target }) => setUser(target.value)}
          maxLength={40}
        />
        <Button color="blue" className="inline-block mt-2">
          Create Account
        </Button>
      </form>
      <div className="flex justify-center">
        <Link
          href="/auth/login"
          className="text-blue-500 underline underline-offset-4 mt-4 inline-block"
        >
          Already have an account? Login
        </Link>
      </div>
    </>
  );
}
