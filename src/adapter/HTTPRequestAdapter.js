class HTTPRequestAdapter {
    static get(data, result) {
        fetch(data.url, {
            method: 'GET'
        })
        .then(response => {
            return response.json();
        })
        .then(dataResult => {
            result(dataResult);
        })
    }

    static post(data, result) {
        fetch(data.url, {
            method: 'POST',
            body: data.body
        })
        .then(response => {
            return response.json();
        })
        .then(dataResult => {
            result(dataResult);
        })
    }
}

export default HTTPRequestAdapter;