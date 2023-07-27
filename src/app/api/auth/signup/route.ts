import { spaceId } from "./../../../../utils/constants";
import { db } from "@/lib/db";
import { generateId } from "@/utils/generateId";
import { setCookie } from "cookies-next";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getErrorMessage } from "@/utils/misc";

export async function POST(req: NextRequest, res: NextResponse) {
  console.log("called");
  try {
    const body = await req.json();

    const { userId } = body;

    if (!userId)
      return NextResponse.json(
        { error: "please provide a valid userId" },
        {
          status: 400,
        }
      );

    const spaceId = generateId();

    const user = await db.user.create({
      data: {
        // --- PUBLIC ID ---
        userId,
        // --- RELATIONS ---
        spaces: {
          createMany: {
            data: [{ spaceId }],
          },
        },
      },
      select: {
        userId: true,
        spaces: true,
      },
    });

    console.log(user);
    // In this demo, we’re just using basic cookies and not implementing a secure authentication system since auth isn’t the purpose of this demo. In a production app you’d implement a secure authentication system.

    // code below not working for some reason :/
    // setCookie("userId", user?.userId, { req, res });

    cookies().set("userId", userId);

    // redirect("/");

    return NextResponse.json({
      data: true,
      user: user,
      useId: userId,
      spaceId,
    });
  } catch (err) {
    console.error(getErrorMessage(err));
  }
}
