import { useEffect, useState } from 'react';
import { Alert, Button, Card, Empty, Flex, Input, Spin, Typography } from 'antd';
import type { Todo } from './types';
import { TodoItem } from './TodoItem';

export default function App() {
  // React concept: useState
  // Each call gives us [currentValue, setterFunction]. Calling the setter
  // stores a new value and tells React to re-render this component.
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTitle, setNewTitle] = useState('');
  // Start as `true` so the first render shows a spinner, not "No todos".
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // React concept: useEffect
  // Fetching data is a *side effect* (it reaches outside React), so it runs
  // in useEffect, after the component has rendered.
  // The empty dependency array `[]` means "run once, when the component
  // first mounts".
  useEffect(() => {
    // `ignore` stops us updating state if the component unmounts before
    // the fetch finishes. (In development, React StrictMode mounts twice on
    // purpose, so this also prevents a double update.)
    let ignore = false;

    async function loadTodos() {
      try {
        // Files in /public are served from the site root.
        const response = await fetch('/todos.json');
        // fetch() does NOT throw on 404/500, so check the status ourselves.
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data: Todo[] = await response.json();
        if (!ignore) setTodos(data);
      } catch (err) {
        if (!ignore) setError(err instanceof Error ? err.message : 'Failed to load todos');
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadTodos();

    // Cleanup: runs when the component unmounts.
    return () => {
      ignore = true;
    };
  }, []);

  // ---------------------------------------------------------------------------
  // State updates are IMMUTABLE: we always build a new array instead of
  // changing the old one (no push/splice, no `todo.completed = true`).
  // React compares the old and new array by reference. If we mutated the
  // existing array the reference would stay the same, and React could skip
  // the re-render.
  // ---------------------------------------------------------------------------

  function addTodo() {
    const title = newTitle.trim();
    if (!title) return; // ignore empty / whitespace-only input

    const todo: Todo = {
      // A unique, stable id. React uses it as the list `key`.
      id: crypto.randomUUID(),
      title,
      completed: false,
    };
    // Spread creates a NEW array: the old todos plus the new one.
    setTodos([...todos, todo]);
    setNewTitle('');
  }

  function toggleTodo(id: string) {
    // map() returns a new array. The changed todo is a new object
    // ({ ...todo, completed: ... }), and every other todo is reused as-is.
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)));
  }

  function deleteTodo(id: string) {
    // filter() returns a new array without the deleted todo.
    setTodos(todos.filter((todo) => todo.id !== id));
  }

  // Derived value: calculated from state on each render instead of stored
  // in its own state, so it can never get out of sync with `todos`.
  const remaining = todos.filter((todo) => !todo.completed).length;

  return (
    <Flex justify="center" style={{ padding: 24 }}>
      <Card title="Simple Todo" style={{ width: '100%', maxWidth: 520 }}>
        <Flex vertical gap="middle">
          {/* Controlled input: React state is the source of truth. Every
              keystroke updates `newTitle`, and the input shows that value. */}
          <Flex gap="small">
            <Input
              placeholder="What needs to be done?"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onPressEnter={addTodo}
              maxLength={100}
            />
            <Button type="primary" onClick={addTodo}>
              Add
            </Button>
          </Flex>

          {/* Conditional rendering: show exactly one of loading / error /
              empty / list, depending on state. */}
          {loading && <Spin />}
          {error && <Alert type="error" title="Could not load todos" description={error} />}
          {!loading && !error && todos.length === 0 && <Empty description="No todos yet" />}

          {/* key={todo.id}: lets React track which item is which between
              renders. Don't use the array index: after a delete, the indexes
              shift and React can attach the wrong state to the wrong row. */}
          {todos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} onToggle={toggleTodo} onDelete={deleteTodo} />
          ))}

          {todos.length > 0 && (
            <Typography.Text type="secondary">{remaining} remaining</Typography.Text>
          )}
        </Flex>
      </Card>
    </Flex>
  );
}
