window.addEventListener("load", () => {
  const form = document.querySelector("#new-task-form");
  const input = document.querySelector("#new-task-input");
  const tasksList = document.querySelector("#tasks");
  const completedTasksList = document.querySelector("#completed-tasks");
  const pendingHeader = document.querySelector("#pending-header");
  const completedHeader = document.querySelector("#completed-header");

  // Load tasks from local storage when the page loads
  loadTasks();

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const task = input.value;

    if (!task) {
      alert("Please fill out the task");
      return;
    }

    const taskElement = createTaskElement(task);

    tasksList.appendChild(taskElement);
    saveTask(task); // Save the task to local storage
    input.value = "";

    taskElement.querySelector(".edit").addEventListener("click", () => {
      handleEditTask(taskElement);
    });

    taskElement.querySelector(".complete").addEventListener("click", () => {
      handleCompleteTask(taskElement);
    });

    taskElement.querySelector(".delete").addEventListener("click", () => {
      handleDeleteTask(taskElement);
    });

    updateHeaders(); // Update headers after adding a task
  });

  function createTaskElement(task) {
    const taskElement = document.createElement("div");
    taskElement.classList.add("task");

    const taskContentElement = document.createElement("div");
    taskContentElement.classList.add("content");

    const taskDateTimeElement = document.createElement("div");
    taskDateTimeElement.classList.add("date_time");
    taskDateTimeElement.textContent = getCurrentDateTime();
    tasksList.appendChild(taskDateTimeElement);

    taskElement.appendChild(taskContentElement);

    const taskInputElement = document.createElement("input");
    taskInputElement.classList.add("text");
    taskInputElement.type = "text";
    taskInputElement.value = task;
    taskInputElement.setAttribute("readonly", "readonly");

    taskContentElement.appendChild(taskInputElement);

    const taskActionsElement = document.createElement("div");
    taskActionsElement.classList.add("actions");

    const taskCompleteElement = document.createElement("button");
    taskCompleteElement.classList.add("complete");
    taskCompleteElement.innerHTML = "Complete";

    const taskEditElement = document.createElement("button");
    taskEditElement.classList.add("edit");
    taskEditElement.innerHTML = "Edit";

    const taskDeleteElement = document.createElement("button");
    taskDeleteElement.classList.add("delete");
    taskDeleteElement.innerHTML = "x";

    taskActionsElement.appendChild(taskCompleteElement);
    taskActionsElement.appendChild(taskEditElement);
    taskActionsElement.appendChild(taskDeleteElement);

    taskElement.appendChild(taskActionsElement);

    return taskElement;
  }

  function getCurrentDateTime() {
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    // Convert hours to 12-hour format
    const formattedHours = hours % 12 || 12;

    return `${date.toLocaleDateString()} ${formattedHours}:${minutes}${ampm}`;
  }

  function handleEditTask(taskElement) {
    const taskInput = taskElement.querySelector(".text");

    if (taskInput.getAttribute("readonly")) {
      taskInput.removeAttribute("readonly");
      taskInput.focus();
      taskElement.querySelector(".edit").innerHTML = "Save";
    } else {
      taskInput.setAttribute("readonly", "readonly");
      taskElement.querySelector(".edit").innerText = "Edit";
    }
  }

  function handleCompleteTask(taskElement) {
    const completeButton = taskElement.querySelector(".complete");

    // Get the associated date/time element
    const dateAndTimeElement = taskElement.previousElementSibling;

    if (completeButton.innerHTML === "Complete") {
      completedTasksList.appendChild(dateAndTimeElement);
      completedTasksList.appendChild(taskElement);
      completeButton.innerHTML = "Incomplete";
    } else {
      tasksList.appendChild(dateAndTimeElement);
      tasksList.appendChild(taskElement);
      completeButton.innerHTML = "Complete";
    }

    updateHeaders(); // Update headers after completing a task
  }

  function handleDeleteTask(taskElement) {
    const parentList = taskElement.parentElement;

    // Remove associated date/time element
    const dateAndTimeElement = taskElement.previousElementSibling;
    parentList.removeChild(dateAndTimeElement);

    // Remove the task element
    parentList.removeChild(taskElement);

    updateHeaders(); // Update headers after deleting a task
  }

  function saveTask(task) {
    let tasks = [];
    if (localStorage.getItem("tasks")) {
      tasks = JSON.parse(localStorage.getItem("tasks"));
    }
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function loadTasks() {
    if (localStorage.getItem("tasks")) {
      const tasks = JSON.parse(localStorage.getItem("tasks"));
      tasks.forEach(task => {
        const taskElement = createTaskElement(task);
        tasksList.appendChild(taskElement);

        // Attach event listeners after loading tasks
        taskElement.querySelector(".edit").addEventListener("click", () => {
          handleEditTask(taskElement);
        });

        taskElement.querySelector(".complete").addEventListener("click", () => {
          handleCompleteTask(taskElement);
        });

        taskElement.querySelector(".delete").addEventListener("click", () => {
          handleDeleteTask(taskElement);
        });
      });
    }

    updateHeaders(); // Update headers after loading tasks
  }

  function updateHeaders() {
    // Show/hide Pending Tasks header
    pendingHeader.style.display = tasksList.children.length > 0 ? 'block' : 'none';

    // Show/hide Completed Tasks header
    completedHeader.style.display = completedTasksList.children.length > 0 ? 'block' : 'none';
  }
});

  
  