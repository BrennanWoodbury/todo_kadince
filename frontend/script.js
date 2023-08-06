//
// running on the page
//
$(document).ready(function () {
    displayTasks();

    // Add new task
    $('#btn-add-task').on('click', function () {
        let newTask = $('#input-form').val();
        data = {
            Name: newTask,
            Status: 0
        };

        postData("/api/new_task", data)
            .then((response) => {
                if (response == "Success") {
                    reloadPageAndShowAlert("Success!", "success");
                }
                else if (response == "Duplicate Value") {
                    displayAlert("Duplicate ToDo list item!", "warning");
                }
                else if (response == "Value cannot be null") {
                    displayAlert("Value cannot be null!", "warning");
                }
            })
            .catch((error) => {
                console.error("Error: ", error);
                displayAlert(`Error: ${error}`, "danger");
            });
    });

    // Handle click event on buttons with class 'btn-delete'
    $('.btn-danger').on('click', function () {
        let parentElement = $(this).parent();
        console.log("Working");
    });

    $('#card-list').on('click', '.btn-delete', function () {
        let parentElement = $(this).closest('.card-body');
        console.log("working")
    })
});


// functions //

// Display all the tasks
function displayTasks() {
    fetch("/api/tasks")
        .then(response => response.json())
        .then(data => {
            const tasksArray = data.tasks;

            const recordsContainer = document.getElementById("card-list");
            let recordsHTML = "";

            tasksArray.forEach(task => {
                recordsHTML += `<div class="card mb-3">
                    <div id=${task._id.$oid} class="card-body">
                        <div>${task.Name}</div>
                        <button id=c${task._id.$oid} class="btn btn-success btn-complete">Complete</button>
                        <button id=e${task._id.$oid} class="btn btn-secondary btn-edit">Edit</button>
                        <button id=d${task._id.$oid} class="btn btn-danger btn-delete">Delete</button>
                    </div>
                </div>`;
                console.log(task);
            });

            recordsContainer.innerHTML = recordsHTML;
        })
        .catch(error => console.error("Error fetching data: ", error));
}


// http methods that require a body
async function postData(url = "", data = {}) {
    let response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    return await response.json();
}


async function deleteData(url = "", data = {}) {
    let response = await fetch(url, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    return await response.json();
}


async function putData(url = "", data = {}) {
    let response = await fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    return await response.json();
}


// Function to create an Alert message
function displayAlert(message, type = 'info') {
    let alertContainer = document.getElementById("alert-div");

    let alertElement = document.createElement("div");
    alertElement.className = `alert alert-${type} fade show`;
    alertElement.textContent = message;

    alertContainer.appendChild(alertElement);

    setTimeout(() => {
        alertElement.classList.remove("show");
        setTimeout(() => {
            alertContainer.removeChild(alertElement);
        }, 1000);
    }, 10000);


}

function reloadPageAndShowAlert(message, type) {
    location.reload();

    displayAlert(message, type);
}


