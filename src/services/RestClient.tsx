import axios from 'axios';
import {ApiData} from '../types/ApiData';
import {HandledPromise} from '../types/HandledPromise';

export class RestClient {
	/*
    "uuidParent": <uuid>,  // UUID of the already lit device
    "uuidChild":  <uuid>,  // UUID of the device to light
    "position": {
        "lat": <float>,    // Latitude  between - 90 & + 90
        "lng": <float>     // Longitude between -180 & +180*/
	static postContact(route: string, data: ApiData): HandledPromise<void> {
		console.log(route);
		console.log(data);
		return new HandledPromise<void>((resolve, reject) => {
			this.post(route, data)
				.then(r => {
					if (r.status == 200) resolve();
					else reject('error.internet.api');
				})
				.then(resolve)
				.catch(() => {
					reject('error.internet.api');
					return;
				});
		});
	}

	private static post(route: string, body?: object) {
		return axios.post(route, body);
	}
	private static get(route: string, query?: object) {
		return axios.get(route, query);
	}
	private static put(route: string, body?: object) {
		return axios.put(route, body);
	}
	private static delete(route: string, query?: object) {
		return axios.delete(route, query);
	}
}
