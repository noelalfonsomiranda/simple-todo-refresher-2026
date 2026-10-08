// TypeScript: describes the shape of one todo. Using this type everywhere
// means a typo like `todo.complete` is a compile error, not a runtime bug.
export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}
