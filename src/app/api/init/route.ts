import { db } from "@/lib/db";

export async function GET() {
  const userId = "userId";

  const user = await db.user.create({
    data: {
      // --- PUBLIC ID ---
      userId,
      // --- RELATIONS ---
      spaces: {
        createMany: {
          data: [{ spaceId: "space1" }],
        },
      },
    },
    select: {
      userId: true,
    },
  });
}
