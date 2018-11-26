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
        const options = {
            method: 'POST',
            body: data.body,
            headers: data.headers
        };

        console.log(data.headers);
        // if(typeof data.headers !== undefined) {
        //     delete options.headers['Content-Type'];
        // }
        
        fetch(data.url, options)
        .then(response => {
            return response.json();
        })
        .then(dataResult => {
            result(dataResult);
        })
    }
}

export default HTTPRequestAdapter;