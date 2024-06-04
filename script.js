document.addEventListener('DOMContentLoaded', () => {
    // знаходимо елементи
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskListTable = document.getElementById('task-list-table');
    const taskListFlex = document.getElementById('task-list-flex');
    const newTaskInput = document.getElementById('new-task');
    const newCategoryInput = document.getElementById('new-category');
    const newDateInput = document.getElementById('new-date');
    const categoryFilter = document.getElementById('category-filter');
    const totalTasksTable = document.getElementById('total-tasks-table');
    const completedTasksTable = document.getElementById('completed-tasks-table');
    const completionPercentageTable = document.getElementById('completion-percentage-table');

    let tasks = [];

    // додаємо прослуховування події - додати завдання
    addTaskBtn.addEventListener('click', () => {
        const taskText = newTaskInput.value.trim();
        const taskCategory = newCategoryInput.value.trim();
        const taskDate = newDateInput.value;
        if (taskText !== '') {
            addTask(taskText, taskCategory, taskDate);
            newTaskInput.value = ''; // Очистити поле вводу
            newCategoryInput.value = ''; // Очистити поле вводу категорії
            newDateInput.value = ''; // Очистити поле вводу дати
        }
    });

    categoryFilter.addEventListener('change', filterTasks);

    // Функція для оновлення статистики
    function updateStats() {
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(task => task.done).length;
        const completionPercentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
        
        totalTasksTable.textContent = totalTasks;
        completedTasksTable.textContent = completedTasks;
        completionPercentageTable.textContent = `${completionPercentage}%`;
    }

    // Функція для фільтрування завдань за категорією
    function filterTasks() {
        const category = categoryFilter.value;
        displayTasks(category);
    }

    // Функція для відображення завдань
    function displayTasks(category) {
        taskListTable.innerHTML = '';
        taskListFlex.innerHTML = '';
        tasks.forEach(task => {
            if (category === 'all' || task.category === category) {
                addTaskToTable(task);
                addTaskToFlex(task);
            }
        });
    }

    // Додавання завдання
    function addTask(text, category, date) {
        const task = {
            text,
            category,
            date,
            done: false
        };
        tasks.push(task);

        if (!Array.from(categoryFilter.options).some(option => option.value === category)) {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        }

        addTaskToTable(task);
        addTaskToFlex(task);
        updateStats();
    }

    // Додавання завдання до таблиці
    function addTaskToTable(task) {
        const tr = document.createElement('tr');
        if (task.done) {
            tr.classList.add('done');
        }

        const tdTask = document.createElement('td');
        tdTask.textContent = task.text;

        const tdCategory = document.createElement('td');
        tdCategory.textContent = task.category;

        const tdAction = document.createElement('td');
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('button-container');

        const doneBtn = document.createElement('button');
        doneBtn.textContent = 'Готово';
        doneBtn.classList.add('done-btn');
        doneBtn.addEventListener('click', () => {
            task.done = !task.done;
            tr.classList.toggle('done');
            updateStats();
        });

        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Видалити';
        removeBtn.classList.add('remove-btn');
        removeBtn.addEventListener('click', () => {
            tasks = tasks.filter(t => t !== task);
            taskListTable.removeChild(tr);
            filterTasks();
            updateStats();
        });

        buttonContainer.appendChild(doneBtn);
        buttonContainer.appendChild(removeBtn);
        tdAction.appendChild(buttonContainer);
        tr.appendChild(tdTask);
        tr.appendChild(tdCategory);
        tr.appendChild(tdAction);
        taskListTable.appendChild(tr);
    }

    // Додавання завдання до адаптивного блоку
    function addTaskToFlex(task) {
        const taskItem = document.createElement('div');
        taskItem.classList.add('task-item');
        if (task.done) {
            taskItem.classList.add('done');
        }

        const taskInfo = document.createElement('div');
        taskInfo.classList.add('task-info');

        const taskText = document.createElement('span');
        taskText.textContent = task.text;

        const taskCategory = document.createElement('span');
        taskCategory.textContent = `Категорія: ${task.category}`;

        const taskDate = document.createElement('span');
        taskDate.textContent = `Дата: ${task.date}`;

        taskInfo.appendChild(taskText);
        taskInfo.appendChild(taskCategory);

        const taskButtons = document.createElement('div');
        taskButtons.classList.add('task-buttons');

        const doneBtn = document.createElement('button');
        doneBtn.textContent = 'Готово';
        doneBtn.classList.add('done-btn');
        doneBtn.addEventListener('click', () => {
            task.done = !task.done;
            taskItem.classList.toggle('done');
            updateStats();
        });

        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Видалити';
        removeBtn.classList.add('remove-btn');
        removeBtn.addEventListener('click', () => {
            tasks = tasks.filter(t => t !== task);
            taskListFlex.removeChild(taskItem);
            filterTasks();
            updateStats();
        });

        taskButtons.appendChild(doneBtn);
        taskButtons.appendChild(removeBtn);

        taskItem.appendChild(taskInfo);
        taskItem.appendChild(taskDate);
        taskItem.appendChild(taskButtons);
        taskListFlex.appendChild(taskItem);
    }

    // Ініціалізація
    filterTasks();
});
