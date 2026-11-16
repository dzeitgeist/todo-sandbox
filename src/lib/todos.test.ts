import { describe, expect, test } from "vitest";
import { TodoStore } from "./TodoStore";
import { createTodo, filterTodos, type Todo } from "./todos";

function todo(title: string, done = false): Todo {
  return { ...createTodo(title), done };
}

describe("createTodo", () => {
  test("trims the title and starts not done", () => {
    const created = createTodo("  buy milk  ");
    expect(created.title).toBe("buy milk");
    expect(created.done).toBe(false);
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
});

describe("TodoStore", () => {
  test("add puts the new todo first", () => {
    const store = new TodoStore([todo("old")]).add("new");
    expect(store.list().map((t) => t.title)).toEqual(["new", "old"]);
  });

  test("toggle flips only the matching todo", () => {
    const [a, b] = [todo("a"), todo("b")];
    const store = new TodoStore([a, b]).toggle(a.id);
    expect(store.list().map((t) => t.done)).toEqual([true, false]);
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
