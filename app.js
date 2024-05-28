document.addEventListener('DOMContentLoaded', () => {
  const newTodoInput = document.getElementById('new-todo');
  const addTodoButton = document.getElementById('add-todo');
  const todoList = document.getElementById('todo-list');
  const todoCount = document.getElementById('todo-count');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const clearCompletedButton = document.getElementById('clear-completed');
  const themeToggleButton = document.getElementById('theme-toggle');

  let todos = [];
  let filter = 'all';

  // Initialize theme based on saved preference
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
  }

  themeToggleButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  });

  function render() {
    const filteredTodos = todos.filter(todo => {
      if (filter === 'all') return true;
      if (filter === 'active') return !todo.completed;
      if (filter === 'completed') return todo.completed;
    });

    todoList.innerHTML = '';
    filteredTodos.forEach((todo, index) => {
      const li = document.createElement('li');
      li.className = todo.completed ? 'completed' : '';
      li.dataset.index = index;
      li.innerHTML = `
        <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
        <span class="todo-text" contenteditable>${todo.text}</span>
        <div class="todo-actions">
          <button class="delete">Delete</button>
        </div>
      `;
      todoList.appendChild(li);
    });

    todoCount.textContent = `${todos.filter(todo => !todo.completed).length} items left`;
  }

  function addTodo() {
    const text = newTodoInput.value.trim();
    if (text) {
      todos.push({ text, completed: false });
      newTodoInput.value = '';
      render();
    }
  }

  function toggleTodoCheckbox(index) {
    todos[index].completed = !todos[index].completed;
    render();
  }

  function deleteTodo(index) {
    todos.splice(index, 1);
    render();
  }

  function clearCompleted() {
    todos = todos.filter(todo => !todo.completed);
    render();
  }

  function editTodoText(index, newText) {
    todos[index].text = newText;
    render();
  }

  addTodoButton.addEventListener('click', addTodo);

  newTodoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTodo();
  });

  todoList.addEventListener('change', (e) => {
    if (e.target.classList.contains('todo-checkbox')) {
      const index = e.target.closest('li').dataset.index;
      toggleTodoCheckbox(index);
    }
  });

  todoList.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete')) {
      const index = e.target.closest('li').dataset.index;
      deleteTodo(index);
    }
  });

  todoList.addEventListener('blur', (e) => {
    if (e.target.classList.contains('todo-text')) {
      const index = e.target.closest('li').dataset.index;
      editTodoText(index, e.target.textContent);
    }
  }, true);

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filter = button.dataset.filter;
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      render();
    });
  });

  clearCompletedButton.addEventListener('click', clearCompleted);

  render();
});
