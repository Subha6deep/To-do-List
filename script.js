document.addEventListener('DOMContentLoaded', function () {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');

    addTaskBtn.addEventListener('click', function () {
        const taskText = taskInput.value.trim();
        if (taskText !== '') {
            addTask(taskText);
            taskInput.value = '';
        }
    });

    taskInput.addEventListener('keyup', function (event) {
        if (event.key === 'Enter') {
            addTaskBtn.click();
        }
    });

    // Load the to-do list from local storage when the page loads
    loadTodoList();

    function addTask(text) {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${text}</span>
            <button class="edit">Edit</button>
            <button class="delete">Delete</button>
            <input type="checkbox" class="tick">
            <input type="datetime-local" class="reminder">
        `;

        const editBtn = li.querySelector('.edit');
        const deleteBtn = li.querySelector('.delete');
        const tickCheckbox = li.querySelector('.tick');
        const reminderInput = li.querySelector('.reminder');

        tickCheckbox.addEventListener('change', function () {
            if (tickCheckbox.checked) {
                li.classList.add('completed');
            } else {
                li.classList.remove('completed');
            }
        });

        editBtn.addEventListener('click', function () {
            const span = li.querySelector('span');
            const newTaskText = prompt('Edit task:', span.innerText);
            if (newTaskText !== null) {
                span.innerText = newTaskText;
                saveTodoList(); // Save the updated list after editing
            }
        });

        deleteBtn.addEventListener('click', function () {
            li.remove();
            saveTodoList(); // Save the updated list after deleting
        });

        reminderInput.addEventListener('change', function () {
            const reminderTime = new Date(reminderInput.value).getTime();
            if (!isNaN(reminderTime) && reminderTime > Date.now()) {
                const currentTime = new Date().getTime();
                const timeUntilReminder = reminderTime - currentTime;
                setTimeout(() => {
                    showReminderNotification(text);
                }, timeUntilReminder);
            }
        });

        taskList.appendChild(li);

        // Save the updated list whenever a task is added
        saveTodoList();
    }

    function showReminderNotification(taskText) {
        if (Notification.permission === 'granted') {
            const notification = new Notification('Task Reminder', {
                body: taskText,
                icon: 'Icon.png', // You can provide your own icon
            });

            notification.onclick = function () {
                // Handle what happens when the user clicks the notification
                // For example, you can open the app or a specific task.
            };
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(function (permission) {
                if (permission === 'granted') {
                    showReminderNotification(taskText);
                }
            });
        }
    }

    function saveTodoList() {
        // Get all task texts and store them in an array
        const tasks = Array.from(taskList.querySelectorAll('li span')).map(
            (task) => task.innerText
        );

        // Convert the array to JSON and save it in local storage
        localStorage.setItem('todoList', JSON.stringify(tasks));
    }

    function loadTodoList() {
        // Check if there's a saved to-do list in local storage
        const savedTodoList = localStorage.getItem('todoList');

        if (savedTodoList) {
            // Parse the saved JSON data and add the tasks to the list
            const tasks = JSON.parse(savedTodoList);
            tasks.forEach((taskText) => {
                addTask(taskText);
            });
        }
    }

    // Request permission for notifications when the page loads
    if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        Notification.requestPermission();
    }
});
