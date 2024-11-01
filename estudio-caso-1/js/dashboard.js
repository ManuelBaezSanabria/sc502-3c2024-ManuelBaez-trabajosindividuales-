    const tasks = [
        { 
            id: 1, 
            title: "Complete project report", 
            description: "Prepare and submit the project report", 
            dueDate: "2024-12-01", 
            comments: ["Review financial section", "Add aa Powe BI"] 
        },
        { 
            id: 2, 
            title: "Team Meeting", 
            description: "Get ready for the season", 
            dueDate: "2024-12-01", 
            comments: ["Prepare presentation slides", "Confirm agenda with 5-team"] 
        },
        { 
            id: 3, 
            title: "Code Review", 
            description: "Check partners code", 
            dueDate: "2024-12-01", 
            comments: ["Ta piola", "Code spaghetti"] 
        },
        { 
            id: 4, 
            title: "Deploy", 
            description: "Check deploy steps", 
            dueDate: "2024-12-01", 
            comments: ["Docker", "Terraform"] 
        }
    ];
document.addEventListener('DOMContentLoaded', function () {

    let isEditMode = false;
    let edittingId;
    let nextTaskId = tasks.length + 1;



    function loadTasks() {
        const taskList = document.getElementById('task-list');
        taskList.innerHTML = '';
        tasks.forEach(function (task) {
            const taskCard = document.createElement('div');
            taskCard.className = 'col-md-4 mb-3';
            taskCard.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${task.title}</h5>
                    <p class="card-text">${task.description}</p>
                    <p class="card-text"><small class="text-muted">Due: ${task.dueDate}</small></p>
                    <div class="comments-section">
                        <h6>Comments</h6>
                        <ul class="list-group mb-2" id="comments-${task.id}">
                            ${task.comments.map(comment => `
                                <li class="list-group-item d-flex justify-content-between align-items-center">
                                    ${comment}
                                    <button class="btn btn-danger btn-sm delete-comment" data-id="${task.id}" data-comment="${comment}">Delete</button>
                                </li>
                            `).join('')}
                        </ul>
                        <div class="input-group mb-3">
                            <input type="text" class="form-control" placeholder="Add comment" id="new-comment-${task.id}">
                            <button class="btn btn-primary add-comment" data-id="${task.id}">Add</button>
                        </div>
                    </div>
                </div>
                <div class="card-footer d-flex justify-content-between">
                    <button class="btn btn-secondary btn-sm edit-task" data-id="${task.id}">Edit</button>
                    <button class="btn btn-danger btn-sm delete-task" data-id="${task.id}">Delete</button>
                </div>
            </div>
            `;
            taskList.appendChild(taskCard);
        });

        document.querySelectorAll('.edit-task').forEach(button => button.addEventListener('click', handleEditTask));
        document.querySelectorAll('.delete-task').forEach(button => button.addEventListener('click', handleDeleteTask));
        document.querySelectorAll('.add-comment').forEach(button => button.addEventListener('click', handleAddComment));
        document.querySelectorAll('.delete-comment').forEach(button => button.addEventListener('click', handleDeleteComment));
    }

    function handleEditTask(event) {
        const taskId = parseInt(event.target.dataset.id);
        const task = tasks.find(t => t.id === taskId);
        if (!task) {
            alert("Task not found");
            return;
        }
        document.getElementById('task-title').value = task.title;
        document.getElementById('task-desc').value = task.description;
        document.getElementById('due-date').value = task.dueDate;
        
        isEditMode = true;
        edittingId = taskId;
        
        const modal = new bootstrap.Modal(document.getElementById("taskModal"));
        modal.show();
    }

    function handleDeleteTask(event) {
        const id = parseInt(event.target.dataset.id);
        const index = tasks.findIndex(t => t.id === id);
        if (index === -1) {
            alert("Task not found");
            return;
        }
        tasks.splice(index, 1);
        loadTasks();
    }

    function handleAddComment(event) {
        const taskId = parseInt(event.target.dataset.id);
        const task = tasks.find(t => t.id === taskId);
        const commentInput = document.getElementById(`new-comment-${taskId}`);
        const commentText = commentInput.value.trim();

        if (commentText) {
            task.comments.push(commentText);
            commentInput.value = '';
            loadTasks();
        }
    }

    function handleDeleteComment(event) {
        const taskId = parseInt(event.target.dataset.id);
        const task = tasks.find(t => t.id === taskId);
        const commentText = event.target.dataset.comment;

        const commentIndex = task.comments.indexOf(commentText);
        if (commentIndex !== -1) {
            task.comments.splice(commentIndex, 1);
            loadTasks();
        }
    }

    document.getElementById('task-form').addEventListener('submit', function (e) {
        e.preventDefault();
        
        const title = document.getElementById("task-title").value;
        const description = document.getElementById("task-desc").value;
        const dueDate = document.getElementById("due-date").value;

        if (isEditMode) {
            const task = tasks.find(t => t.id === edittingId);
            if (task) {
                task.title = title;
                task.description = description;
                task.dueDate = dueDate;
            }
        } else {
            const newTask = { id: nextTaskId++, title, description, dueDate, comments: [] };
            tasks.push(newTask);
        }
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('taskModal'));
        modal.hide();
        loadTasks();
    });

    document.getElementById('taskModal').addEventListener('show.bs.modal', function () {
        if (!isEditMode) document.getElementById('task-form').reset();
    });

    document.getElementById("taskModal").addEventListener('hidden.bs.modal', function () {
        edittingId = null;
        isEditMode = false;
    });

    loadTasks();
});
