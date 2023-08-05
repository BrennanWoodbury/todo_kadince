
document.addEventListener('DOMContentLoaded', () => {

    // just a button to test connection to the backend database
    const testConnectButton = document.getElementById('test-connect-btn');

    testConnectButton.addEventListener('click', () => {
        const apiUrl = '/api/tasks';

        fetch(apiUrl)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                    console.log(`${response}`);
                }
                return response.json();
            })
            .then((data) => {
                console.log('API Response:', data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    });



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
                console.log(response);
            })
            .catch((error) => {
                console.error("Error: ", error)
            });

    });



    // 


});