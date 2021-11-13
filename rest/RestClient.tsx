import axios from 'axios';
class restClient {
    constructor(baseUrl: string) {}

    get(route: string, query?: object) {
        return axios.get(route, query).catch(function (e) {
            console.warn(e);
        });
    }

    post(route: string, body?: object) {
        return axios.post(route, body).catch(function (e) {
            console.warn(e);
        });
    }

    put(route: string, body?: object) {
        return axios.put(route, body).catch(function (e) {
            console.warn(e);
        });
    }

    delete(route: string, query?: object) {
        return axios.delete(route, query).catch(function (e) {
            console.warn(e);
        });
    }
}

export default restClient;
