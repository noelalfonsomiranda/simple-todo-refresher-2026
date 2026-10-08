import { Button, Checkbox, Flex, Typography } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import type { Todo } from './types';

// Props: the data this component receives from its parent.
// The parent owns the state; this component only displays one todo and
// reports user actions back through callbacks ("data down, events up").
interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <Flex justify="space-between" align="center">
      <Checkbox checked={todo.completed} onChange={() => onToggle(todo.id)}>
        <Typography.Text delete={todo.completed}>{todo.title}</Typography.Text>
      </Checkbox>
      <Button
        type="text"
        danger
        icon={<DeleteOutlined />}
        aria-label={`Delete ${todo.title}`}
        onClick={() => onDelete(todo.id)}
      />
    </Flex>
  );
}
