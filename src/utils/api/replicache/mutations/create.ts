import { getErrorMessage } from "@/utils/misc";
import { MutationArgs } from "./index";

export const createMutations = async ({
  args,
  spaceId,
  tx,
  versionNext,
}: MutationArgs) => {
  const prismaTodoFindUnique = await tx.todo.findUnique({
    where: { todoId: args.todoId },
  });

  if (prismaTodoFindUnique) return;

  // Update sort order
  const count = await tx.todo.count({
    where: { AND: [{ isDeleted: false }, { spaceId }] },
  });

  try {
    await tx.todo.create({
      data: {
        // --- SYSTEM ---
        versionUpdatedAt: versionNext,
        // --- RELATIONS ---
        space: { connect: { spaceId } },
        // --- FIELDS ---
        ...args,
        sortOrder: count,
      },
      select: { todoId: true },
    });
  } catch (err) {
    console.error(getErrorMessage(err));
  }

  return;
};
