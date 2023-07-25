import { spaceId } from "./../utils/constants";
import { Args } from "@prisma/client/runtime/library";
import { useEffect, useState } from "react";
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
}: {
  spaceId: string;
  userId: string;
}) => {
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
        schemaVersion: "0",
        name: `${userId}/${spaceId}`,
        licenseKey: process.env.NEXT_PUBLIC_REPLICACHE!,
        pushURL: `/api/replicache/push?spaceId=${spaceId}`,
        pullURL: `/api/replicache/pull?spaceId=${spaceId}`,
        mutators,
      });

      setRep(r);

      return () => void r.close();
    }
  }, [spaceId, userId]);

  return { data: rep };
};

export type ReplicacheInstanceType = ReturnType<typeof useReplicache>;
