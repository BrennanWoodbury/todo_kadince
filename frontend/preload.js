// load the tasklist
function displayTasks() {
    fetch("/api/tasks")
        .then(response => response.json())
        .then(data => {
            const tasksArray = data.tasks;

            const recordsContainer = document.getElementById("card-list");
            let recordsHTML = "";

            tasksArray.forEach(task => {
                recordsHTML += `<div class="card mb-3">
                    <div class="card-body">
                        <div>${task.Name}</div>
                        <button class="btn btn-success">Edit</button>
                        <button class="btn btn-danger">Delete</button>
                    </div>
                </div>`;
                console.log(task);
            });

            recordsContainer.innerHTML = recordsHTML;
            console.log(data);
        })
        .catch(error => console.error("Error fetching data: ", error));
}

displayTasks();