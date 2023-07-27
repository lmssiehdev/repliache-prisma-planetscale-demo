import { db } from "@/lib/db";
import { generateId } from "@/utils/generateId";
import { setCookie } from "cookies-next";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function POST(req: NextRequest, res: NextResponse) {
  const body = await req.json();

  const { userId } = body;

  if (!userId)
    return NextResponse.json(
      { error: "please provide a valid userId" },
      {
        status: 400,
      }
    );

  const user = await db.user.findFirst({
    where: {
      userId: userId,
    },
    select: {
      userId: true,
      spaces: true,
    },
  });

  const spaceId = user?.spaces[0].spaceId;

  // In this demo, we’re just using basic cookies and not implementing a secure authentication system since auth isn’t the purpose of this demo. In a production app you’d implement a secure authentication system.

  // code below not working for some reason :/
  // setCookie("userId", user?.userId, { req, res, maxAge: 60 * 6 * 24 });
  if (!user?.userId)
    return NextResponse.json(
      {
        error: "user_not_found",
      }
      //  {
      //   status:
      // }
    );

  cookies().set("userId", user?.userId);
  console.log("done");

  // redirect("/");

  return NextResponse.json({
    data: true,
    userId,
    spaceId,
  });
}
