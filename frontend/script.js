// script.js
document.addEventListener('DOMContentLoaded', () => {
    const testConnectButton = document.getElementById('test-connect-btn');

    testConnectButton.addEventListener('click', () => {
        // Handle button click event here
        // Replace "http://localhost:8001" with the actual API URL
        const apiUrl = '/api/tasks'; // Replace with your API URL

        // Use fetch() to make a GET request to the API
        fetch(apiUrl)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                    console.log(`${response}`);
                }
                return response.json();
            })
            .then((data) => {
                // Process the data received from the API
                console.log('API Response:', data);
            })
            .catch((error) => {
                // Handle errors if any occurred during the API request
                console.error('Error fetching data:', error);
            });
    });
});


function displayTasks() {
    fetch("/api/tasks")
        .then(response => response.json())
        .then(data => {
            const tasksArray = data.tasks; // Access the tasks array from the data object

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

/*
                <div class="card mb-3">
                    <div class="card-body">
                        <div> Task 1 </div>
                        <button class="btn btn-success">Edit</button>
                        <button class="btn btn-danger">Delete</button>
                    </div>
                </div>
*/