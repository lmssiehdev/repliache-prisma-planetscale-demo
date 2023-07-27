import { resetAccount } from "@/utils/resetAccount";
import { useRouter } from "next/navigation";
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import { Replicache, type WriteTransaction } from "replicache";

type MutatorArgs = Record<string, any>;

type MutatorsParams = {
  tx: WriteTransaction;
  args: MutatorArgs;
  spaceId: string;
};

const MutationsTodoCreate = async ({ tx, args, spaceId }: MutatorsParams) => {
  const key = `${spaceId}/todo/${args.todoId}`;

  if (await tx.has(key)) throw new Error("Todo already exists");

  const todos = await MutationsTodoGet({ tx, args, spaceId });

  return await tx.put(key, { ...args, sortOrder: todos?.length });
};

const MutationsTodoDelete = async ({ tx, args, spaceId }: MutatorsParams) =>
  await tx.del(`${spaceId}/todo/${args}`);

const MutationsTodoGet = async ({ tx, args, spaceId }: MutatorsParams) =>
  await tx
    .scan({ prefix: `${spaceId}/todo/` })
    .values()
    .toArray();

const MutationsTodoUpdate = async ({ tx, args, spaceId }: MutatorsParams) => {
  const key = `${spaceId}/todo/${args.todoId}`;

  const prev = ((await tx.get(key)) as Record<string, any>) ?? {};

  return await tx.put(key, { ...prev, ...args });
};

const deleteHabitMutation = async ({ tx, args, spaceId }: MutatorsParams) =>
  await tx.del(`${spaceId}/habit/${args}`);

const getHabitsMutation = async ({ tx, args, spaceId }: MutatorsParams) =>
  await tx
    .scan({ prefix: `${spaceId}/habit/` })
    .values()
    .toArray();

const createHabitMutation = async ({ tx, args, spaceId }: MutatorsParams) => {
  const key = `${spaceId}/habit/${args.todoId}`;

  if (await tx.has(key)) throw new Error("Habit already exists");

  const habits = await getHabitsMutation({ tx, args, spaceId });

  return await tx.put(key, { ...args, sortOrder: habits?.length });
};

const updateHabitMutation = async ({ tx, args, spaceId }: MutatorsParams) => {
  const key = `${spaceId}/habit/${args.todoId}`;

  const prev = ((await tx.get(key)) as Record<string, any>) ?? {};

  return await tx.put(key, { ...prev, ...args });
};

export const useReplicache = ({
  spaceId,
  userId,
  setSpaceId,
  setUserId,
}: {
  spaceId: string | null;
  userId: string | null;
  setSpaceId: Dispatch<SetStateAction<string | null>>;
  setUserId: Dispatch<SetStateAction<string | null>>;
}) => {
  const router = useRouter();

  const mutators = {
    create: (tx: WriteTransaction, args: MutatorArgs) =>
      createHabitMutation({ tx, args, spaceId }),
    delete: (tx: WriteTransaction, args: MutatorArgs) =>
      deleteHabitMutation({ tx, args, spaceId }),
    get: (tx: WriteTransaction, args: MutatorArgs) =>
      getHabitsMutation({ tx, args, spaceId }),
    update: (tx: WriteTransaction, args: MutatorArgs) =>
      updateHabitMutation({ tx, args, spaceId }),
  };

  const [rep, setRep] = useState<Replicache<typeof mutators> | null>(null);

  useEffect(() => {
    if (userId && spaceId) {
      const r = new Replicache({
        name: `${userId}/${spaceId}`,
        licenseKey: process.env.NEXT_PUBLIC_REPLICACHE!,
        pushURL: `/api/replicache/push?spaceId=${spaceId}`,
        pullURL: `/api/replicache/pull?spaceId=${spaceId}`,
        mutators,
        // added some delay to prevent spamming the DB in case of an error
        // you should delete this if you want to sync as soon as possible
      });

      // This gets called when the push/pull API returns a `401`.
      r.getAuth = () => {
        // resetAccount({ setSpaceId, setUserId });

        // router.push("/login");

        return undefined;
      };

      setRep(r);

      return () => void r.close();
    }
  }, [spaceId, userId]);

  return { data: rep };
};

export type ReplicacheInstanceType = ReturnType<typeof useReplicache>;
