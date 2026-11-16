export type Priority = "low" | "normal" | "high";

export type Todo = {
  id: string;
  title: string;
  done: boolean;
  priority: Priority;
  createdAt: number;
  completedAt?: number;
};

export type Filter = "all" | "active" | "done" | "high";

const STORAGE_KEY = "todo-sandbox:todos";

// Higher numbers sort first.
const PRIORITY_RANK: Record<Priority, number> = { high: 2, normal: 1, low: 0 };

export function loadTodos(): Todo[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    // Todos saved before priorities existed have none; treat them as normal.
    return raw
      ? (JSON.parse(raw) as Todo[]).map((t) => ({
          ...t,
          priority: t.priority ?? "normal",
        }))
      : [];
  } catch {
    return [];
  }
}

export function saveTodos(todos: Todo[]): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

export function createTodo(title: string, priority: Priority = "normal"): Todo {
  return {
    id: crypto.randomUUID(),
    title: title.trim(),
    done: false,
    priority,
    createdAt: Date.now(),
  };
}

export function filterTodos(todos: Todo[], filter: Filter): Todo[] {
  if (filter === "active") return todos.filter((t) => !t.done);
  if (filter === "done") return todos.filter((t) => t.done);
  if (filter === "high") return todos.filter((t) => t.priority === "high" && !t.done);
  return todos;
}

export function sortTodos(todos: Todo[]): Todo[] {
  return todos.sort((a, b) => PRIORITY_RANK[b.priority] - PRIORITY_RANK[a.priority]);
}
