const axios = require('axios')

let res = await axios.get('http://localhost:8001/api/health_check')
    .then((response) => {
        console.log(response.data);
        console.log(response.status);
        console.log(response.statusText);
        console.log(response.headers);
        console.log(response.config);
    });