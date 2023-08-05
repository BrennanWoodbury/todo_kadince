
document.addEventListener('DOMContentLoaded', () => {

    // // just a button to test connection to the backend database
    // const testConnectButton = document.getElementById('test-connect-btn');

    // testConnectButton.addEventListener('click', () => {
    //     const apiUrl = '/api/tasks';

    //     fetch(apiUrl)
    //         .then((response) => {
    //             if (!response.ok) {
    //                 throw new Error('Network response was not ok');
    //                 console.log(`${response}`);
    //             }
    //             return response.json();
    //         })
    //         .then((data) => {
    //             console.log('API Response:', data);
    //         })
    //         .catch((error) => {
    //             console.error('Error fetching data:', error);
    //         });
    // });



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
    // add new task
    const addTasKButton = document.getElementById('btn-add-task');
    addTasKButton.addEventListener('click', () => {
        let newTask = document.getElementById('input-form').value;
        data = {
            Name: newTask
        };
        console.log(data);

        postData("/api/new_task", data)
            .then((response) => {
                if (response == "Success") {
                    displayAlert("Success!", "success");
                }
                else if (response == "Duplicate Value") {
                    displayAlert("Duplicate ToDo list item!", "warning")
                }
            })
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.error("Error: ", error)
                displayAlert(`Error: ${error}`, danger)
            });


    });

    const deleteButton = document.getElementById("btn-delete")
    deleteButton.addEventListener("click", () => {

    })

    // 


});




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
                    <div class="card-body">
                        <div>${task.Name}</div>
                        <button class="btn btn-secondary">Complete</button>
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
        }, 1000)
    }, 10000)


}   