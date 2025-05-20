const WebApp = window.Telegram.WebApp;
WebApp.ready();

// Initialize tasks
let tasks = [];
try {
  const storedTasks = WebApp.CloudStorage.getItem('tasks');
  if (storedTasks) {
    tasks = JSON.parse(storedTasks) || [];
  }
} catch (e) {
  console.error('Error parsing tasks from WebApp.CloudStorage:', e);
  tasks = [];
}

// Render tasks
function renderTasks() {
  const taskList = document.getElementById('taskList');
  if (!taskList) {
    console.error('taskList element not found');
    return;
  }
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
    WebApp.CloudStorage.setItem('tasks', JSON.stringify(tasks)); // Fixed storage
    taskInput.value = '';
    renderTasks();
    // Optionally send data to bot
    WebApp.sendData(JSON.stringify({ action: 'add', task }));
  }
}

// Delete a task
function deleteTask(index) {
  tasks.splice(index, 1);
  WebApp.CloudStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks();
  // Optionally send data to bot
  WebApp.sendData(JSON.stringify({ action: 'delete', index }));
}

// Add a function to play sound
function playSound() {
  const audio = new Audio('static/huh.mp3');
  audio.play();
}

// Initialize the app
WebApp.expand(); // Make the app full-screen
renderTasks();

// Customize the Telegram Web App button (optional)
WebApp.MainButton.setText('Save Tasks').show().onClick(() => {
  WebApp.sendData(JSON.stringify({ action: 'save', tasks }));
});

