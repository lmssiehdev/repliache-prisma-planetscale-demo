"use client";

import { useDay } from "@/hooks/useDayjs";
import { usePokeListener } from "@/hooks/usePokeListener";
import { useReplicache } from "@/hooks/useReplicache";
import { spaceId, userId } from "@/utils/constants";
import { generateId } from "@/utils/generateId";
import { useEffect, useState } from "react";
import { type ReadTransaction } from "replicache";
import { useSubscribe } from "replicache-react";

export default function Home() {
  const { data: rep } = useReplicache({ userId, spaceId });

  usePokeListener({ rep });

  return <Todos rep={rep} />;
}

function Todos({ rep }) {
  const [habitName, setHabitName] = useState("");
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

  type Todo = {
    todoId: string;
    isDeleted: boolean;
    name: string;
    selectedDays: Record<string, boolean>;
  };

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

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          console.log("I've been called");
          handleAddTodo(habitName);
        }}
      >
        <input
          value={habitName}
          onChange={({ target }) => setHabitName(target.value)}
        ></input>
        <button type="submit">Add Todo</button>
      </form>
      {todos?.some((x) => x)
        ? todos
            ?.sort((a, b) => a.sortOrder - b.sortOrder)
            ?.map((todo) => (
              <div key={todo.id} className="flex gap-2 items-center">
                <p>
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
                  <span>{todo.name}</span>
                  <button
                    onClick={async () => await rep.mutate.delete(todo.todoId)}
                    className="bg-red-400 text-red-700"
                  >
                    Delete
                  </button>
                </p>
                <div className="flex gap-2 items-center ">
                  {week.map((weekDay) => (
                    <div
                      onClick={() => updateHabitStatus({ ...todo }, weekDay)}
                      key={weekDay}
                      className="border border-black h-5 w-5 cursor-pointer"
                      style={{
                        backgroundColor: todo.selectedDays?.[weekDay] && "red",
                      }}
                    ></div>
                  ))}
                </div>
              </div>
            ))
        : null}
    </div>
  );
}
