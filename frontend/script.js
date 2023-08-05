// script.js
document.addEventListener('DOMContentLoaded', () => {
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
                // Process the data received from the API
                console.log('API Response:', data);
            })
            .catch((error) => {
                // Handle errors if any occurred during the API request
                console.error('Error fetching data:', error);
            });
    });
});

// 
const addTasKButton = document.getElementById('btn-add-task');
addTasKButton.addEventListener('click', () => {


})

