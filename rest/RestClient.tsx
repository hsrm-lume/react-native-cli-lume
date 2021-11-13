import axios from 'axios';
class restClient {
    static get(route: string, query?: object) {
        return axios.get(route, query).catch(function (e) {
            console.warn(e);
        });
    }

    static post(route: string, body?: object) {
        return axios.post(route, body).catch(function (e) {
            console.warn(e);
        });
    }

    static put(route: string, body?: object) {
        return axios.put(route, body).catch(function (e) {
            console.warn(e);
        });
    }

    static delete(route: string, query?: object) {
        return axios.delete(route, query).catch(function (e) {
            console.warn(e);
        });
    }
}

export default restClient;
