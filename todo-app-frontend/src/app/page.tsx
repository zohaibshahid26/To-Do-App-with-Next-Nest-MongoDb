"use client";
import { useEffect, useState } from 'react';

interface Todo {
  _id: string;
  title: string;
  description: string;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<{ title: string; description: string }>({ title: '', description: '' });
  const [editTodo, setEditTodo] = useState<Todo | null>(null);
  const backendUrl = "http://localhost:3000";

  useEffect(() => {
    fetch(`${backendUrl}/todos`)
      .then(response => response.json())
      .then(data => {
        const todosWithId = data.map((todo: any) => ({
          _id: todo._id, // Correctly map _id here
          title: todo.title,
          description: todo.description,
        }));
        setTodos(todosWithId);
      })
      .catch(error => console.error('Error fetching todos:', error));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editTodo) {
      setEditTodo(prevEditTodo => prevEditTodo ? { ...prevEditTodo, [name]: value } : null);
    } else {
      setNewTodo(prevState => ({ ...prevState, [name]: value }));
    }
  };

  const handleAddTodo = () => {
    fetch(`${backendUrl}/todos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTodo),
    })
      .then(response => response.json())
      .then(data => {
        setTodos(prevTodos => [...prevTodos, data]);
        setNewTodo({ title: '', description: '' }); // Clear form after adding
      })
      .catch(error => console.error('Error adding todo:', error));
  };

  const handleEditTodo = (todo: Todo) => {
    setEditTodo(todo);
  };

  const handleUpdateTodo = () => {
    if (!editTodo) return;

    fetch(`${backendUrl}/todos/${editTodo._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editTodo),
    })
      .then(response => response.json())
      .then(updatedTodo => {
        setTodos(prevTodos => prevTodos.map(todo => (todo._id === updatedTodo._id ? updatedTodo : todo)));
        setEditTodo(null); // Clear edit state after updating
      })
      .catch(error => console.error('Error updating todo:', error));
  };

  const handleDeleteTodo = (_id: string) => {
    fetch(`${backendUrl}/todos/${_id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo._id !== _id));
      })
      .catch(error => console.error('Error deleting todo:', error));
  };

  return (
    <div className='d-flex align-items-center justify-content-center'>
      <div className="min-h-screen bg-gray-100 p-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-slate-950">Todo List</h1>
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">{editTodo ? 'Edit Todo' : 'Add Todo'}</h2>
          <div className="space-y-4">
            <input
              type="text"
              name="title"
              value={editTodo ? editTodo.title : newTodo.title}
              onChange={handleInputChange}
              placeholder="Title"
              className="w-full p-2 border border-gray-300 rounded text-black"
            />
            <input
              type="text"
              name="description"
              value={editTodo ? editTodo.description : newTodo.description}
              onChange={handleInputChange}
              placeholder="Description"
              className="w-full p-2 border border-gray-300 rounded text-black"
            />
            <button
              onClick={editTodo ? handleUpdateTodo : handleAddTodo}
              className={`w-full py-2 text-white rounded ${editTodo ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'}`}
            >
              {editTodo ? 'Update Todo' : 'Add Todo'}
            </button>
          </div>
        </div>
        <ul className="space-y-4">
          {todos.map(todo => (
            <li key={todo._id} className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-black">{todo.title}</h2>
              <p className="text-gray-600">{todo.description}</p>
              <div className="mt-4 space-x-2">
                <button
                  onClick={() => handleEditTodo(todo)}
                  className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteTodo(todo._id)}
                  className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
