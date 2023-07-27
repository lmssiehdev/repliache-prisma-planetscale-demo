"use client";

import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { useDay } from "@/hooks/useDayjs";
import { useOnLoad } from "@/hooks/useOnLoad";
import { usePokeListener } from "@/hooks/usePokeListener";
import { useReplicache } from "@/hooks/useReplicache";
import { generateId } from "@/utils/generateId";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { type ReadTransaction } from "replicache";
import { useSubscribe } from "replicache-react";

type Habit = {
  todoId: string;
  isDeleted: boolean;
  name: string;
  selectedDays: Record<string, boolean>;
};

export default function Home() {
  const router = useRouter();

  const [userId, setUserId] = useState<string | null>("");
  const [spaceId, setSpaceId] = useState<string | null>("");

  useOnLoad({ setSpaceId, setUserId });

  const { data: rep } = useReplicache({
    userId,
    spaceId,
    setSpaceId,
    setUserId,
  });

  usePokeListener({ rep });

  if (!spaceId || !userId)
    return (
      <div>
        <button
          onClick={() => {
            router.push("/login");
          }}
        >
          Log in
        </button>
      </div>
    );

  return (
    <div>
      <div className="my-4 flex justify-between items-center">
        <h2 className=" text-lg">{`Welcome ${userId}`}</h2>
        <Button color="red" size="sm">
          Logout
        </Button>
      </div>
      <Todos rep={rep} spaceId={spaceId} />
    </div>
  );
}

function Todos({ rep, spaceId }) {
  const { chunk: week } = useDay();

  const todos = useSubscribe(
    rep,
    async (tx: ReadTransaction) =>
      await tx.scan({ prefix: `${spaceId}/habit` }).toArray(),
    [rep]
  );

  useEffect(() => {
    console.log(todos);
  }, [todos]);

  async function handleAddTodo(name: string) {
    const todoId = generateId();
    await rep?.mutate.create({
      todoId,
      isDeleted: false,
      name: name,
      selectedDays: {},
    });
  }

  async function updateHabitStatus(todo: any, date: string) {
    const selectedDays = Object.assign({}, todo.selectedDays);

    console.log(selectedDays[date]);
    if (selectedDays[date]) delete selectedDays[date];
    else selectedDays[date] = true;

    await rep?.mutate.update({ ...todo, selectedDays });
  }

  async function deleteHabit(habitId: string) {
    await rep.mutate.delete(habitId);
  }

  return (
    <div className="gap-2">
      <AddTodoInput addTodo={handleAddTodo} />
      <div className="flex flex-col gap-2 mt-2">
        {todos?.some((x) => x)
          ? todos
              ?.sort((a, b) => a.sortOrder - b.sortOrder)
              ?.map((todo) => (
                <HabitItem
                  key={todo.id}
                  habit={todo}
                  week={week}
                  updateHabitStatus={updateHabitStatus}
                  deleteHabit={deleteHabit}
                />
              ))
          : null}
      </div>
    </div>
  );
}

function AddTodoInput({ addTodo }: { addTodo: (name: string) => void }) {
  const [habitName, setHabitName] = useState("");

  return (
    <form
      className="flex gap-2 items-center"
      onSubmit={(e) => {
        e.preventDefault();
        console.log("I've been called");
        addTodo(habitName);
      }}
    >
      <Input
        type="text"
        value={habitName}
        onChange={({ target }) => setHabitName(target.value)}
        maxLength={40}
      ></Input>
      <Button
        color="green"
        size="sm"
        type="submit"
        className="whitespace-nowrap block w-fit"
      >
        Add Todo
      </Button>
    </form>
  );
}

function HabitItem({
  habit,
  week,
  updateHabitStatus,
  deleteHabit,
}: {
  habit: Habit;
  updateHabitStatus: (habit: Habit, date: string) => void;
  deleteHabit: (habitId: string) => void;
  week: string[];
}) {
  return (
    <div className="grid grid-cols-[1.5fr_3fr] gap-5 items-center ">
      <div className="flex items-center justify-between">
        {/* <button
                  onClick={() => {
                    rep.mutate.update({
                      todoId: todo.todoId,
                      isDeleted: false,
                      name: `${todo.name} ${todo.todoId}`,
                    });
                  }}
                >
                  Change Name
                </button>{" "} */}
        <span>{habit.name}</span>
        <button
          onClick={() => deleteHabit(habit.todoId)}
          className=" text-red-700"
        >
          x
        </button>
      </div>
      <div className="flex gap-2 items-center flex-1 justify-between">
        {week.map((weekDay) => (
          <div
            onClick={() => updateHabitStatus({ ...habit }, weekDay)}
            key={weekDay}
            className="border-dashed border-[1px] border-black/60 text-white h-7 w-7"
            style={{
              backgroundColor: habit.selectedDays?.[weekDay] ? "#B5D6B8" : "",
            }}
          ></div>
        ))}
      </div>
    </div>
  );
}
