import { PrismaTx } from "@/types";
import { createMutations } from "./create";
import { deleteMutations } from "./delete";
import { updateMutations } from "./update";

export type MutationArgs = {
  args: Record<string, any>;
  spaceId: string;
  tx: PrismaTx;
  versionNext: number;
};

export const mutationsApi = async ({
  lastMutationId,
  mutations,
  spaceId,
  tx,
  versionNext,
}: {
  lastMutationId: number;
  mutations: any;
} & Omit<MutationArgs, "args">) => {
  let nextMutationId = lastMutationId;

  for await (const mutation of mutations) {
    // Verify before processing mutation
    if (mutation.id < nextMutationId + 1) {
      console.log(
        `Mutation ${mutation.id} has already been processed - skipping`
      );
      continue;
    }

    if (mutation.id > nextMutationId + 1) {
      console.warn(`Mutation ${mutation.id} is from the future - aborting`);
      break;
    }

    try {
      console.log(
        "Processing mutation",
        nextMutationId + 1,
        JSON.stringify(mutation)
      );

      if (mutation.name === "create")
        await createMutations({
          args: mutation.args,
          spaceId,
          tx,
          versionNext,
        });
      else if (mutation.name === "update")
        await updateMutations({
          args: mutation.args,
          spaceId,
          tx,
          versionNext,
        });
      else if (mutation.name === "delete")
        await deleteMutations({
          args: mutation.args,
          spaceId,
          tx,
          versionNext,
        });

      // Only increase mutation id upon successful mutation
      nextMutationId++;
    } catch (err) {
      console.error(err);
    }
  }

  return { data: nextMutationId };
};
