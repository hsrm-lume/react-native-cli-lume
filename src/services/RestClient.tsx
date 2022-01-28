import axios, {AxiosResponse} from 'axios';
import {environment} from '../env/environment';
import {GeoLocation} from '../types';
import {HandledPromise} from '../types/HandledPromise';

export class RestClient {
	/**
	 * @param uuidParent uuid of the parent node
	 * @param uuidChild uuid of the new child node
	 * @param position position of the child node
	 * @returns HandledPromise to catch eventual errors while posting
	 */
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
			if (r.status !== 200) throw new Error('Api-Error: ' + r.statusText);
		});
	}

	// some private wrappers for the axios methods
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
