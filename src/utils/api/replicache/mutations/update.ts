import { getErrorMessage } from "@/utils/misc";
import { MutationArgs } from "./index";

export const updateMutations = async ({
  args,
  spaceId,
  tx,
  versionNext,
}: MutationArgs) => {
  try {
    await tx.todo.update({
      where: { todoId: args.todoId },
      data: {
        // --- SYSTEM ---
        versionUpdatedAt: versionNext,
        // --- RELATIONS ---
        space: { connect: { spaceId } },
        // --- FIELDS ---
        ...args,
      },
      select: { todoId: true },
    });
  } catch (err) {
    console.error(getErrorMessage(err));
  }

  return;
};
