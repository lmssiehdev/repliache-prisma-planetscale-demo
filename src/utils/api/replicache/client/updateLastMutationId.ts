import { PrismaTx } from "@/types";

export const updateLastMutationId = async ({
  replicacheClientId,
  nextMutationId,
  tx,
}: {
  replicacheClientId: string;
  nextMutationId: number;
  tx: PrismaTx;
}) => {
  console.log(
    "Setting",
    replicacheClientId,
    "replicacheClientId to",
    nextMutationId
  );

  await tx.replicacheClient.update({
    where: { replicacheClientId },
    data: { lastMutationId: nextMutationId },
  });
};
