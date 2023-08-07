$(document).ready(function () {
    // Display all the tasks on the page
    displayTasks();

    const alertMessage = sessionStorage.getItem('alertMessage');
    const alertType = sessionStorage.getItem('alertType');

    if (alertMessage && alertType) {
        displayAlert(alertMessage, alertType);
        // Clear the stored alert information after displaying it
        sessionStorage.removeItem('alertMessage');
        sessionStorage.removeItem('alertType');
    }
    // Add new task
    $('#btn-add-task').on('click', function () {
        let newTask = $('#input-form').val();
        data = {
            Name: newTask,
            Status: 0
        };
        console.log(data);

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

    // logic for delete button
    $('#card-list').on('click', '.btn-delete', function () {
        let parentElement = $(this).closest('.card-body');
        let parentId = $(this).closest('[id]').attr('id');
        let taskName = $(this).closest('.card-body').find('.task-name').text();

        data = {
            _id: parentId,
            Name: taskName,
            Status: 0
        }

        console.log(data)
        deleteData("/api/delete_task", data)

        reloadPageAndShowAlert("Task deleted", "info")

    })

    // logic for edit button
    $('#card-list').on('click', '.btn-edit', function () {
        let parentElement = $(this).closest('.card-body');
        let thisElement = $(this).closest('.task-name');
        let currentText = thisElement.text();
        let parentId = parentElement.attr('id');

        parentElement.html(`
        <div class="card mb-3">
            <div> 
                <input id="edit${parentId}" type="text" class="form-control" value="${currentText}" placeholder="Edit task name..."/>
                <button id="save${parentId}" class="btn btn-success btn-save"> Save </button>
                <button id="cancel${parentId}" class="btn btn-secondary btn-cancel"> Cancel </button>
            </div>
        </div>`);

        $(`#save${parentId}`).on('click', function () {
            let updatedName = $(`#edit${parentId}`).val()
            data = {
                _id: parentId,
                Name: updatedName
            };
            putData("/api/update_task", data)
                .then(response => {
                    console.log(response);
                    reloadPageAndShowAlert("Successfully edited the task", "success")
                })
                .catch((error) => {
                    console.error("Error: ", error);
                    displayAlert(`Error: ${error}`, "danger");
                });
        })


    })

    // logic for complete button
    $('#card-list').on('click', '.btn-complete', function () {
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
                        <div class="task-name" >${task.Name}</div>
                        <button class="btn btn-success btn-complete">Complete</button>
                        <button class="btn btn-secondary btn-edit">Edit</button>
                        <button class="btn btn-danger btn-delete">Delete</button>
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
    let alertElement = $(`<div class="alert alert-${type} fade show">${message}</div>`);

    $("#alert-div").append(alertElement);

    setTimeout(() => {
        alertElement.removeClass("show");
        setTimeout(() => {
            alertElement.remove();
        }, 1000);
    }, 10000);
}

// Store the alert information in sessionStorage before reloading the page
function reloadPageAndShowAlert(message, type) {
    sessionStorage.setItem('alertMessage', message);
    sessionStorage.setItem('alertType', type);

    location.reload();
}

