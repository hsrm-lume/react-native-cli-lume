import axios from 'axios';
import {environment} from '../env/environment';
import {GeoLocation} from '../types';
import {HandledPromise} from '../types/HandledPromise';

export class RestClient {
	/*
    "uuidParent": <uuid>,  // UUID of the already lit device
    "uuidChild":  <uuid>,  // UUID of the device to light
    "position": {
        "lat": <float>,    // Latitude  between - 90 & + 90
        "lng": <float>     // Longitude between -180 & +180*/
	static postContact(
		uuidParent: string,
		uuidChild: string,
		position: GeoLocation
	): HandledPromise<void> {
		return new HandledPromise<void>((resolve, reject) => {
			this.post(environment.API_BASE_DOMAIN + environment.API_CONTACT_PATH, {
				uuidChild: uuidChild,
				uuidParent: uuidParent,
				position: position,
			})
				.then(r => {
					if (r.status == 200) resolve();
					else throw new Error('Api-Error: ' + r.statusText);
				})
				.then(resolve)
				.catch(reject);
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
