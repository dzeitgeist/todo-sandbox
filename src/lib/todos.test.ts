import { describe, expect, test } from "vitest";
import { TodoStore } from "./TodoStore";
import { createTodo, filterTodos, sortTodos, type Priority, type Todo } from "./todos";

function todo(title: string, done = false, priority: Priority = "normal"): Todo {
  return { ...createTodo(title, priority), done };
}

describe("createTodo", () => {
  test("trims the title and starts not done, at normal priority", () => {
    const created = createTodo("  buy milk  ");
    expect(created.title).toBe("buy milk");
    expect(created.done).toBe(false);
    expect(created.priority).toBe("normal");
  });
});

describe("filterTodos", () => {
  const todos = [todo("a"), todo("b", true), todo("c")];

  test("all returns everything", () => {
    expect(filterTodos(todos, "all")).toHaveLength(3);
  });

  test("active returns only unfinished todos", () => {
    expect(filterTodos(todos, "active").map((t) => t.title)).toEqual(["a", "c"]);
  });

  test("done returns only finished todos", () => {
    expect(filterTodos(todos, "done").map((t) => t.title)).toEqual(["b"]);
  });

  test("high returns unfinished high-priority todos", () => {
    const mixed = [todo("x", false, "high"), todo("y", true, "high"), todo("z")];
    expect(filterTodos(mixed, "high").map((t) => t.title)).toEqual(["x"]);
  });
});

describe("sortTodos", () => {
  test("puts high priority first and low priority last", () => {
    const todos = [todo("l", false, "low"), todo("n"), todo("h", false, "high")];
    expect(sortTodos(todos).map((t) => t.title)).toEqual(["h", "n", "l"]);
  });
});

describe("TodoStore", () => {
  test("add puts the new todo first", () => {
    const store = new TodoStore([todo("old")]).add("new");
    expect(store.list().map((t) => t.title)).toEqual(["new", "old"]);
  });

  test("toggle flips only the matching todo and records when it was done", () => {
    const [a, b] = [todo("a"), todo("b")];
    const store = new TodoStore([a, b]).toggle(a.id);
    expect(store.list().map((t) => t.done)).toEqual([true, false]);
    expect(store.list()[0].completedAt).toBeTypeOf("number");
  });

  test("clearDone removes finished todos", () => {
    const store = new TodoStore([todo("a", true), todo("b")]).clearDone();
    expect(store.list().map((t) => t.title)).toEqual(["b"]);
  });

  test("does not mutate the list it was given", () => {
    const original = [todo("a")];
    new TodoStore(original).add("b").toggle(original[0].id);
    expect(original).toHaveLength(1);
    expect(original[0].done).toBe(false);
  });
});
