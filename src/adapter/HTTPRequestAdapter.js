class HTTPRequestAdapter {
    static get(url, result) {
        fetch(url, {
            method: 'GET'
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