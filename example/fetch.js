var axios = require('axios');
var SMOCK = require('./urlsReal');
let apiDoc;
function a() {
    console.log(url);
    return new Promise((resolve, reject) => {
        axios({
            url: 'http://10.182.30.155/v2/api-docs'
        })
        .then((data) => {
            // resolve(data.data);
            apiDoc = data.data;
            resolve(apiDoc);
            console.log(apiDoc);
        })
    })
}
a().then((data) => {
    console.log(apiDoc.definitions['ResultResponse«ApplyBooking»']);
})
