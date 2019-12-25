(function () {
    var restfulURL = function(url, param) {
        let result = url;
        for(var prop in param) {
            result = result.replace('{'+prop+'}', param[prop]);
        }
        return result;
    }
    var url = '/api/service/{serviceId}';
    var newUrl = restfulURL(url, {
        serviceId: 1
    });
    console.log(newUrl);
})()