import { db } from "@/lib/db";
import { setCookie } from "cookies-next";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  const { searchParams } = new URL(req.url);

  const userId = searchParams.get("userId");
  const spaceId = searchParams.get("spaceId");

  if (!userId || !spaceId)
    return NextResponse.json(
      { error: "please provide a valid userId and spaceId" },
      {
        status: 400,
      }
    );

  const user = await db.user.create({
    data: {
      // --- PUBLIC ID ---
      userId,
      // --- RELATIONS ---
      spaces: {
        createMany: {
          data: [{ spaceId: spaceId }],
        },
      },
    },
    select: {
      userId: true,
    },
  });

  // In this demo, we’re just using basic cookies and not implementing a secure authentication system since auth isn’t the purpose of this demo. In a production app you’d implement a secure authentication system.
  // @ts-expect-error
  // setCookie("userId", user?.userId, { req, res });

  NextResponse.json({ data: true, user });
}
