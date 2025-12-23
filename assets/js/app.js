/* ================= TASKS ================= */
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

addBtn.onclick = () => {
  if (taskInput.value.trim() === "") return;
  tasks.push({ text: taskInput.value, completed: false });
  taskInput.value = "";
  saveTasks();
};

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
  updateAnalytics();
}

function renderTasks(list = tasks) {
  taskList.innerHTML = "";
  list.forEach((t, i) => {
    const li = document.createElement("li");
    li.textContent = t.text;
    if (t.completed) li.style.textDecoration = "line-through";

    li.onclick = () => {
      t.completed = !t.completed;
      saveTasks();
    };

    const del = document.createElement("button");
    del.textContent = "❌";
    del.onclick = e => {
      e.stopPropagation();
      tasks.splice(i, 1);
      saveTasks();
    };

    li.appendChild(del);
    taskList.appendChild(li);
  });
}

function showAll() { renderTasks(tasks); }
function showPending() { renderTasks(tasks.filter(t => !t.completed)); }
function showCompleted() { renderTasks(tasks.filter(t => t.completed)); }

/* ================= HABITS ================= */
const habitInput = document.getElementById("habitInput");
const addHabitBtn = document.getElementById("addHabitBtn");
const habitList = document.getElementById("habitList");

let habits = JSON.parse(localStorage.getItem("habits")) || [];

addHabitBtn.onclick = () => {
  if (habitInput.value.trim() === "") return;
  habits.push({ name: habitInput.value, streak: 0, last: null });
  habitInput.value = "";
  saveHabits();
};

function saveHabits() {
  localStorage.setItem("habits", JSON.stringify(habits));
  renderHabits();
  updateAnalytics();
}

function renderHabits() {
  habitList.innerHTML = "";
  const today = new Date().toDateString();

  habits.forEach((h, i) => {
    const li = document.createElement("li");
    li.textContent = `${h.name} 🔥 ${h.streak}`;

    const btn = document.createElement("button");
    btn.textContent = "Done Today";
    btn.onclick = () => {
      if (h.last !== today) {
        h.streak++;
        h.last = today;
        saveHabits();
      }
    };

    li.appendChild(btn);
    habitList.appendChild(li);
  });
}

/* ================= POMODORO ================= */
let time = 1500;
let interval = null;
let sessions = Number(localStorage.getItem("sessions")) || 0;

const timerEl = document.getElementById("timer");
const sessionEl = document.getElementById("sessions");

function startPomodoro() {
  if (interval) return;
  interval = setInterval(() => {
    time--;
    updateTimer();
    if (time <= 0) {
      clearInterval(interval);
      interval = null;
      sessions++;
      localStorage.setItem("sessions", sessions);
      sessionEl.textContent = sessions;
      time = 1500;
    }
  }, 1000);
}

function resetPomodoro() {
  clearInterval(interval);
  interval = null;
  time = 1500;
  updateTimer();
}

function updateTimer() {
  timerEl.textContent =
    Math.floor(time / 60) + ":" + String(time % 60).padStart(2, "0");
}

/* ================= ANALYTICS ================= */
function updateAnalytics() {
  document.getElementById("totalTasks").textContent = tasks.length;
  document.getElementById("completedTasks").textContent =
    tasks.filter(t => t.completed).length;
  document.getElementById("totalHabits").textContent = habits.length;
}

/* ================= SETTINGS ================= */
function resetAll() {
  if (!confirm("Reset all data?")) return;
  localStorage.clear();
  location.reload();
}

/* INIT */
renderTasks();
renderHabits();
updateAnalytics();
updateTimer();
sessionEl.textContent = sessions;
/* ========== HERO INTRO REMOVE ========== */
setTimeout(() => {
  const hero = document.getElementById("hero");
  if (hero) hero.remove();
}, 3200);
