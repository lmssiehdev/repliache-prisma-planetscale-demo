import { PrismaTx } from "@/types";

export const updateVersion = async ({
  tx,
  spaceId,
  versionAt,
}: {
  tx: PrismaTx;
  spaceId: string;
  versionAt: number;
}) => {
  try {
    const prismaSpaceUpdate = await tx.space.update({
      where: { spaceId },
      data: { versionAt },
      select: { versionAt: true },
    });

    return { data: prismaSpaceUpdate };
  } catch (err) {
    console.error(err);
  }
};
