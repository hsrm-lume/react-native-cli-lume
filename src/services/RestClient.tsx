import axios, {AxiosResponse} from 'axios';
import {environment} from '../env/environment';
import {GeoLocation} from '../types';
import {ApiData} from '../types/ApiData';
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
	) {
		return HandledPromise.from<AxiosResponse>(
			'internet.api',
			this.post(environment.API_BASE_DOMAIN + environment.API_CONTACT_PATH, {
				uuidChild: uuidChild,
				uuidParent: uuidParent,
				position: position,
			})
		).then(r => {
			if (r.status != 200) throw new Error('Api-Error: ' + r.statusText);
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
