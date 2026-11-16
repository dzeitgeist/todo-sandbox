// Keeps every change to the todo list in one place. Each method returns a new store instead of
// mutating, so React sees a new value and re-renders.
import { createTodo, type Priority, type Todo } from "./todos";

export class TodoStore {
  private readonly todos: Todo[];

  constructor(todos: Todo[]) {
    this.todos = todos;
  }

  list(): Todo[] {
    return this.todos;
  }

  add(title: string, priority?: Priority): TodoStore {
    return new TodoStore([createTodo(title, priority), ...this.todos]);
  }

  toggle(id: string): TodoStore {
    return new TodoStore(
      this.todos.map((t) =>
        t.id === id
          ? { ...t, done: !t.done, completedAt: t.done ? undefined : Date.now() }
          : t,
      ),
    );
  }

  remove(id: string): TodoStore {
    return new TodoStore(this.todos.filter((t) => t.id !== id));
  }

  clearDone(): TodoStore {
    return new TodoStore(this.todos.filter((t) => !t.done));
  }
}
