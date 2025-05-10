// Initialize Telegram Web App
const WebApp = window.Telegram.WebApp;
WebApp.ready();

// Load tasks from WebApp.DeviceStorage
let tasks = JSON.parse(WebApp.DeviceStorage.getItem('tasks')) || [];

// Render tasks
function renderTasks() {
  const taskList = document.getElementById('taskList');
  taskList.innerHTML = '';
  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      ${task}
      <button onclick="deleteTask(${index})">Delete</button>
    `;
    taskList.appendChild(li);
  });
}

// Add a new task
function addTask() {
  const taskInput = document.getElementById('taskInput');
  const task = taskInput.value.trim();
  if (task) {
    tasks.push(task);
    WebApp.DeviceStorage.setItem('tasks', JSON.stringify(tasks));
    taskInput.value = '';
    renderTasks();
    // Optionally send data to bot
    WebApp.sendData(JSON.stringify({ action: 'add', task }));
  }
}

// Delete a task
function deleteTask(index) {
  tasks.splice(index, 1);
  WebApp.DeviceStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks();
  // Optionally send data to bot
  WebApp.sendData(JSON.stringify({ action: 'delete', index }));
}

// Initialize the app
WebApp.expand(); // Make the app full-screen
renderTasks();

// Customize the Telegram Web App button (optional)
WebApp.MainButton.setText('Save Tasks').show().onClick(() => {
  WebApp.sendData(JSON.stringify({ action: 'save', tasks }));
});