import { useState, useEffect } from "react";
import "./App.css";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  category: "work" | "personal" | "other";
}

function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const savedTodos = localStorage.getItem("todos");
    return savedTodos ? JSON.parse(savedTodos) : [];
  });

  const [inputValue, setInputValue] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [category, setCategory] = useState<"work" | "personal" | "other">(
    "personal"
  );

  // 保存到 localStorage
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (inputValue.trim()) {
      const newTodo: Todo = {
        id: Date.now(),
        text: inputValue.trim(),
        completed: false,
        category,
      };
      setTodos([newTodo, ...todos]);
      setInputValue("");
      setCategory("personal");
    }
  };

  const toggleComplete = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const startEditing = (id: number, text: string) => {
    setEditingId(id);
    setEditValue(text);
  };

  const saveEdit = () => {
    if (editingId !== null && editValue.trim()) {
      setTodos(
        todos.map((todo) =>
          todo.id === editingId ? { ...todo, text: editValue.trim() } : todo
        )
      );
      setEditingId(null);
      setEditValue("");
    }
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  const activeCount = todos.filter((todo) => !todo.completed).length;
  const completedCount = todos.length - activeCount;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addTodo();
    }
  };

  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      saveEdit();
    } else if (e.key === "Escape") {
      setEditingId(null);
      setEditValue("");
    }
  };

  return (
    <div className="app-container">
      <div className="todo-app">
        <header className="header">
          <h1>TodoList</h1>
          <p>高效管理你的任务</p>
        </header>

        <div className="add-todo-section">
          <div className="input-group">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="添加新任务..."
              className="todo-input"
            />
            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value as "work" | "personal" | "other")
              }
              className="category-select"
            >
              <option value="work">工作</option>
              <option value="personal">个人</option>
              <option value="other">其他</option>
            </select>
            <button onClick={addTodo} className="add-button">
              添加
            </button>
          </div>
        </div>

        <div className="controls">
          <div className="filters">
            <button
              onClick={() => setFilter("all")}
              className={filter === "all" ? "active" : ""}
            >
              全部 ({todos.length})
            </button>
            <button
              onClick={() => setFilter("active")}
              className={filter === "active" ? "active" : ""}
            >
              进行中 ({activeCount})
            </button>
            <button
              onClick={() => setFilter("completed")}
              className={filter === "completed" ? "active" : ""}
            >
              已完成 ({completedCount})
            </button>
          </div>
        </div>

        <div className="stats">
          <div className="stat-item">
            <span className="stat-number">{todos.length}</span>
            <span className="stat-label">总任务</span>
          </div>
          <div className="stat-item">
            <span className="stat-number" style={{ color: "#67c23a" }}>
              {activeCount}
            </span>
            <span className="stat-label">进行中</span>
          </div>
          <div className="stat-item">
            <span className="stat-number" style={{ color: "#909399" }}>
              {completedCount}
            </span>
            <span className="stat-label">已完成</span>
          </div>
        </div>

        <div className="todo-list">
          {filteredTodos.length === 0 ? (
            <div className="empty-state">
              <p>暂无任务，开始添加一些吧！</p>
            </div>
          ) : (
            filteredTodos.map((todo) => (
              <div
                key={todo.id}
                className={`todo-item ${todo.completed ? "completed" : ""} ${
                  todo.category
                }`}
              >
                {editingId === todo.id ? (
                  <div className="edit-mode">
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={saveEdit}
                      onKeyDown={handleEditKeyDown}
                      autoFocus
                      className="edit-input"
                    />
                  </div>
                ) : (
                  <>
                    <div
                      className="todo-content"
                      onClick={() => toggleComplete(todo.id)}
                    >
                      <div className="checkbox">
                        {todo.completed ? "✓" : ""}
                      </div>
                      <span className="todo-text">{todo.text}</span>
                      <span className="todo-category">
                        {todo.category === "work" && "💼 工作"}
                        {todo.category === "personal" && "👤 个人"}
                        {todo.category === "other" && "📁 其他"}
                      </span>
                    </div>
                    <div className="todo-actions">
                      <button
                        onClick={() => startEditing(todo.id, todo.text)}
                        className="edit-btn"
                      >
                        编辑
                      </button>
                      <button
                        onClick={() => deleteTodo(todo.id)}
                        className="delete-btn"
                      >
                        删除
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
