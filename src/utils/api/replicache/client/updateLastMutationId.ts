export const updateLastMutationId = async ({
  replicacheClientId,
  nextMutationId,
  tx,
}: {
  replicacheClientId: string;
  nextMutationId: number;
  tx: any;
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
