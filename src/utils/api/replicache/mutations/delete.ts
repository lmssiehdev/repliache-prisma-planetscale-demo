import { getErrorMessage } from "@/utils/misc";
import { MutationArgs } from "./index";

export const deleteMutations = async ({
  args,
  spaceId,
  tx,
  versionNext,
}: MutationArgs) => {
  try {
    await tx.todo.updateMany({
      where: { AND: [{ todoId: args }, { spaceId }] },
      data: {
        // --- SYSTEM ---
        versionUpdatedAt: versionNext,
        // --- FIELDS ---
        isDeleted: true,
      },
    });
  } catch (err) {
    console.error(getErrorMessage(err));
  }

  return;
};
