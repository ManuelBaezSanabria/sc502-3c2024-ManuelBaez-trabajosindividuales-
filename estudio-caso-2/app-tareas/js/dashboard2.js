document.addEventListener('DOMContentLoaded', function () {

    let isEditMode = false;
    let edittingId;
    let tasks = [];
    let comments = [];
    const API_URL = 'backend/tasks.php';
    const API_URL2 = 'backend/comments.php';

async function loadTasksAndComments() {
    try {
        // Cargar tareas
        const response = await fetch(API_URL, {
            method: 'GET',
            credentials: 'include',
        });

        if (!response.ok) {
            if (response.status == 401) {
                window.location.href = 'index.html';
            }
            throw new Error('Error al obtener tareas');
        }

        tasks = await response.json();

        // Cargar comentarios para cada tarea
        for (let task of tasks) {
            task.comments = await loadComments(task.id); // Obtener comentarios individualmente
        }

        // Renderizar todas las tareas con comentarios ya cargados
        renderTasks(tasks);
    } catch (err) {
        console.error(err);
    }
}

async function loadComments(task_id) {
    try {
        const response = await fetch(`${API_URL2}?task_id=${task_id}`, {
            method: 'GET',
            credentials: 'include',
        });

        if (!response.ok) {
            if (response.status == 401) {
                window.location.href = 'index.html';
            }
            throw new Error('Error al obtener comentarios');
        }

        const comments = await response.json();
        return Array.isArray(comments) ? comments : []; 
    } catch (err) {
        console.error(err);
        return []; // En caso de error, retorna un array vacío
    }
}
  
    function renderTasks(tasks) {
        const taskList = document.getElementById('task-list');
        taskList.innerHTML = ''; 
    
        tasks.forEach(task => {
            // Verifica que `comments` sea un array válido
            const comments = task.comments && Array.isArray(task.comments) ? task.comments : [];
    
            // Generar el listado de comentarios
            let commentsList = '';
            if (comments.length > 0) {
                commentsList = '<ul class="list-group list-group-flush">';
                comments.forEach(comment => {
                    commentsList += `
                        <li class="list-group-item">${comment.comment || 'Comentario sin descripción'} 
                            <button type="button" class="btn btn-sm btn-link remove-comment" 
                            data-visitid="${task.id}" data-commentid="${comment.id}">Remove</button>
                        </li>`;
                });
                commentsList += '</ul>';
            } else {
                commentsList = '<p>No hay comentarios.</p>';
            }
    
            // Crear la tarjeta de la tarea
            const taskCard = document.createElement('div');
            taskCard.className = 'col-md-4 mb-3';
            taskCard.innerHTML = `
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${task.title}</h5>
                        <p class="card-text">${task.description}</p>
                        <p class="card-text"><small class="text-muted">Due: ${task.due_date}</small></p>
                        ${commentsList}
                        <button type="button" class="btn btn-sm btn-link add-comment" data-id="${task.id}">Add Comment</button>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button class="btn btn-secondary btn-sm edit-task" data-id="${task.id}">Edit</button>
                        <button class="btn btn-danger btn-sm delete-task" data-id="${task.id}">Delete</button>
                    </div>
                </div>
            `;
    
            taskList.appendChild(taskCard);
        });

        document.querySelectorAll('.edit-task').forEach(function (button) {
            button.addEventListener('click', handleEditTask);
        });

        document.querySelectorAll('.delete-task').forEach(function (button) {
            button.addEventListener('click', handleDeleteTask);
        });

        document.querySelectorAll('.add-comment').forEach(function (button) {
            button.addEventListener('click', function (e) {
                // alert(e.target.dataset.id);
                document.getElementById("comment-task-id").value = e.target.dataset.id;
                const modal = new bootstrap.Modal(document.getElementById("commentModal"));
                modal.show()

            })
        });
        document.querySelectorAll('.remove-comment').forEach(function (button) {
            button.addEventListener('click', handleDeleteComment)
        });
    }

    async function handleDeleteComment(event) {
        const id = parseInt(event.target.dataset.commentid);
        const response = await fetch(`${API_URL2}?id=${id}`,{
            method: 'DELETE',
            credentials: 'include'
        });
        if (response.ok) {
            loadTasksAndComments();
        } else {
            console.error("Error eliminando las tareas");
        }
    }

    function handleEditTask(event) {
        try {
            // alert(event.target.dataset.id);
            //localizar la tarea quieren editar
            const taskId = parseInt(event.target.dataset.id);
            const task = tasks.find(t => t.id === taskId);
            //cargar los datos en el formulario 
            document.getElementById('task-title').value = task.title;
            document.getElementById('task-desc').value = task.description;
            document.getElementById('due-date').value = task.due_date;
            //ponerlo en modo edicion
            isEditMode = true;
            edittingId = taskId;
            //mostrar el modal
            const modal = new bootstrap.Modal(document.getElementById("taskModal"));
            modal.show();


        } catch (error) {
            alert("Error trying to edit a task");
            console.error(error);
        }
    }


    async function handleDeleteTask(event) {
        const id = parseInt(event.target.dataset.id);
        const response = await fetch(`${API_URL}?id=${id}`,{
            method: 'DELETE',
            credentials: 'include'
        });
        if (response.ok) {
            loadTasksAndComments();
        } else {
            console.error("Error eliminando las tareas");
        }
    }

    document.getElementById('comment-form').addEventListener('submit', async function (e) {
        e.preventDefault();
        const comment = document.getElementById('task-comment').value;
        const selectedTask = parseInt(document.getElementById('comment-task-id').value);
        const task = tasks.find(t => t.id === selectedTask);


        let nextCommentId = 1;

        if (task.comments) {
            nextCommentId = task.comments.length + 1;
        } else {
            task.comments = [];
        }

        if (isEditMode) {
            //editar
            const response = await fetch(`${API_URL2}?id=${edittingId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: nextCommentId, task_id: selectedTask, comment: comment }),
                credentials: "include"
            });
            if (!response.ok) {
                console.error("Sucedio un error");
            }

        } else {
            const newComment = {
                id: nextCommentId, 
                task_id: selectedTask, 
                comment: comment
            };
            //enviar la tarea al backend
            const response = await fetch(API_URL2, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newComment),
                credentials: "include"
            });
            if (!response.ok) {
                console.error("Sucedio un error");
            }
        }


        
        const modal = bootstrap.Modal.getInstance(document.getElementById('commentModal'));
        modal.hide();
        loadTasksAndComments();

    })

    document.getElementById('task-form').addEventListener('submit', async function (e) {
        e.preventDefault();

        const title = document.getElementById("task-title").value;
        const description = document.getElementById("task-desc").value;
        const dueDate = document.getElementById("due-date").value;

        if (isEditMode) {
            //editar
            const response = await fetch(`${API_URL}?id=${edittingId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title: title, description: description, due_date: dueDate }),
                credentials: "include"
            });
            if (!response.ok) {
                console.error("Sucedio un error");
            }

        } else {
            const newTask = {
                title: title,
                description: description,
                due_date: dueDate
            };
            //enviar la tarea al backend
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newTask),
                credentials: "include"
            });
            if (!response.ok) {
                console.error("Sucedio un error");
            }
        }
        const modal = bootstrap.Modal.getInstance(document.getElementById('taskModal'));
        modal.hide();
        loadTasksAndComments();
    });

    document.getElementById('commentModal').addEventListener('show.bs.modal', function () {
        document.getElementById('comment-form').reset();
    })

    document.getElementById('taskModal').addEventListener('show.bs.modal', function () {
        if (!isEditMode) {
            document.getElementById('task-form').reset();
            // document.getElementById('task-title').value = "";
            // document.getElementById('task-desc').value = "";
            // document.getElementById('due-date').value = "";
        }
    });

    document.getElementById("taskModal").addEventListener('hidden.bs.modal', function () {
        edittingId = null;
        isEditMode = false;
    })
    loadTasksAndComments()

});