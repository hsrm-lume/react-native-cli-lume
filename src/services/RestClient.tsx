import axios from 'axios';
import {apiData} from '../types/apiData';
import {transmissionData} from '../types/tranmissionData';
class restClient {
    static get(route: string, query?: object) {
        return axios.get(route, query).catch(function (e) {
            console.warn(e);
        });
    }
    /*
    "uuidParent": <uuid>,  // UUID of the already lit device
    "uuidChild":  <uuid>,  // UUID of the device to light
    "position": {
        "lat": <float>,    // Latitude  between - 90 & + 90
        "lng": <float>     // Longitude between -180 & +180*/

    static post(route: string, body?: object) {
        return axios.post(route, body).catch(function (e) {
            console.warn(e);
        });
    }

    static postContact(route: string, data: apiData) {
        console.log(route);
        console.log(data);
        return axios
            .post(route, {
                uuidParent: data.uuidParent,
                uuidChild: data.uuidChild,
                position: {
                    lat: parseFloat(data.position.lat),
                    lng: parseFloat(data.position.lng),
                },
            })
            .then(function (r) {
                return r.status;
            })
            .catch(function (e) {
                console.warn(e);
            });
    }

    static put(route: string, body?: object) {
        return axios({method: 'post', url: route});
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
