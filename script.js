const STORAGE_KEY = "dz-todo-tasks";
let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
let currentFilter = "all";

const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");
const statsText = document.getElementById("stats-text");
const clearBtn = document.getElementById("clear-completed");
const filterBtns = document.querySelectorAll(".filter");

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function render() {
  const filtered = tasks.filter(t => {
    if (currentFilter === "active") return !t.completed;
    if (currentFilter === "completed") return t.completed;
    return true;
  });

  list.innerHTML = "";

  if (filtered.length === 0) {
    list.innerHTML = '<li class="empty">No tasks here. Add one above!</li>';
  } else {
    filtered.forEach(task => {
      const li = document.createElement("li");
      li.className = "todo-item" + (task.completed ? " completed" : "");
      li.innerHTML = `
        <div class="checkbox" data-id="${task.id}"></div>
        <span class="text">${escapeHtml(task.text)}</span>
        <button class="delete" data-id="${task.id}">×</button>
      `;
      list.appendChild(li);
    });
  }

  const activeCount = tasks.filter(t => !t.completed).length;
  statsText.textContent = `${activeCount} active · ${tasks.length} total`;

  if (tasks.some(t => t.completed)) {
    clearBtn.style.display = "block";
  } else {
    clearBtn.style.display = "none";
  }
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  tasks.push({
    id: Date.now().toString(),
    text: text,
    completed: false
  });
  input.value = "";
  save();
  render();
});

list.addEventListener("click", (e) => {
  const id = e.target.dataset.id;
  if (!id) return;

  if (e.target.classList.contains("checkbox")) {
    const task = tasks.find(t => t.id === id);
    if (task) {
      task.completed = !task.completed;
      save();
      render();
    }
  }

  if (e.target.classList.contains("delete")) {
    tasks = tasks.filter(t => t.id !== id);
    save();
    render();
  }
});

filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    render();
  });
});

clearBtn.addEventListener("click", () => {
  tasks = tasks.filter(t => !t.completed);
  save();
  render();
});

render();