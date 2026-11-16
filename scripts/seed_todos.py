"""Print a browser-console snippet that fills the app with sample todos.

The app keeps todos in localStorage, so seeding means pasting one line into the
browser console on http://localhost:3000 and reloading.

Usage: python scripts/seed_todos.py [count]
"""

import json
import sys
import time
import uuid

STORAGE_KEY = "todo-sandbox:todos"  # must match STORAGE_KEY in src/lib/todos.ts

TITLES = [
    "Buy milk",
    "Write the weekly update",
    "Fix the flaky login test",
    "Book dentist appointment",
    "Review Alice's pull request",
    "Water the plants",
]


def make_todo(title, done=False):
    return {
        "id": str(uuid.uuid4()),
        "title": title,
        "done": done,
        "createdAt": int(time.time() * 1000),
    }


def build_seed(count):
    return [make_todo(TITLES[i % len(TITLES)], done=i % 3 == 0) for i in range(count)]


class SnippetPrinter:
    """Turns todos into a localStorage.setItem call that can be pasted into the console."""

    def __init__(self, stream):
        self.stream = stream

    def snippet(self, todos):
        payload = json.dumps(json.dumps(todos))
        return f"localStorage.setItem({json.dumps(STORAGE_KEY)}, {payload}); location.reload();"

    def print(self, todos):
        self.stream.write(self.snippet(todos) + "\n")


def main(argv):
    count = int(argv[0]) if argv else 6
    SnippetPrinter(sys.stdout).print(build_seed(count))


if __name__ == "__main__":
    main(sys.argv[1:])
