document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("task-form");
    const input = document.getElementById("task-input");
    const list = document.getElementById("task-list");
    const error = document.getElementById("error-message");
    const tg = window.Telegram.WebApp;

    // Expand the WebApp to full screen (optional)
    tg.expand();

    let tasks = [];

    // Load tasks from Telegram storage
    try {
        const savedTasks = tg.DeviceStorage.getItem("tasks");
        tasks = savedTasks ? JSON.parse(savedTasks) : [];
    } catch (e) {
        console.error("Failed to parse tasks:", e);
        tasks = [];
    }

    function saveTasks() {
        tg.DeviceStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function renderTasks() {
        list.innerHTML = "";
        tasks.forEach((task, index) => {
            const li = document.createElement("li");
            li.className = "task-item";
            if (task.completed) li.classList.add("completed");

            const span = document.createElement("span");
            span.textContent = task.text;
            span.className = "text";
            span.addEventListener("click", () => toggleTask(index));

            const btn = document.createElement("button");
            btn.textContent = "✖";
            btn.className = "delete-btn";
            btn.addEventListener("click", () => deleteTask(index));

            li.appendChild(span);
            li.appendChild(btn);
            list.appendChild(li);
        });
    }

    function addTask(text) {
        tasks.push({ text, completed: false });
        saveTasks();
        renderTasks();
    }

    function toggleTask(index) {
        tasks[index].completed = !tasks[index].completed;
        saveTasks();
        renderTasks();
    }

    function deleteTask(index) {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
    }

    form.addEventListener("submit", e => {
        e.preventDefault();
        const text = input.value.trim();

        if (text === "") {
            error.style.display = "block";
            return;
        }

        error.style.display = "none";
        addTask(text);
        input.value = "";
    });

    // Initial render
    renderTasks();
});