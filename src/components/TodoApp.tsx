"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { TodoItem } from "@/components/TodoItem";
import { TodoStore } from "@/lib/TodoStore";
import {
  filterTodos,
  loadTodos,
  saveTodos,
  sortTodos,
  type Filter,
  type Priority,
} from "@/lib/todos";

const FILTERS: Filter[] = ["all", "active", "high", "done"];
const PRIORITIES: Priority[] = ["low", "normal", "high"];

const noopSubscribe = () => () => {};

export function TodoApp() {
  const [store, setStore] = useState(() => new TodoStore(loadTodos()));
  const todos = store.list();
  // false during SSR and hydration, true afterwards - avoids a mismatch
  // between the server's empty list and the client's stored todos.
  const loaded = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
  const [draft, setDraft] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [priority, setPriority] = useState<Priority>("normal");

  useEffect(() => {
    saveTodos(todos);
  }, [todos]);

  function addTodo(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.trim()) return;
    setStore((s) => s.add(draft, priority));
    setDraft("");
    setPriority("normal");
  }

  function toggleTodo(id: string) {
    setStore((s) => s.toggle(id));
  }

  function deleteTodo(id: string) {
    setStore((s) => s.remove(id));
  }

  function clearDone() {
    setStore((s) => s.clearDone());
  }

  const visible = sortTodos(filterTodos(todos, filter));
  const remaining = todos.filter((t) => !t.done || t.priority === "high").length;

  return (
    <div className="w-full max-w-md space-y-4">
      <form onSubmit={addTodo} className="flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="What needs doing?"
          className="flex-1 rounded-md border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
          aria-label="Priority"
          className="rounded-md border border-zinc-300 px-2 py-2 capitalize dark:border-zinc-700 dark:bg-zinc-900"
        >
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-md bg-black px-4 py-2 text-white dark:bg-white dark:text-black"
        >
          Add
        </button>
      </form>

      <div className="flex items-center justify-between text-sm">
        <div className="flex gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded px-2 py-1 capitalize ${
                filter === f ? "bg-zinc-200 dark:bg-zinc-800" : ""
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <span className="text-zinc-500">{loaded ? remaining : 0} left</span>
      </div>

      <ul className="space-y-2">
        {loaded && visible.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
          />
        ))}
        {loaded && visible.length === 0 && (
          <li className="py-6 text-center text-sm text-zinc-500">
            Nothing here.
          </li>
        )}
      </ul>

      {loaded && todos.some((t) => t.done) && (
        <button
          onClick={clearDone}
          className="text-sm text-zinc-500 hover:underline"
        >
          Clear completed
        </button>
      )}
    </div>
  );
}
