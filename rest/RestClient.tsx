import RestClient from 'react-native-rest-client';

class Client extends RestClient {

	constructor(baseUrl: string) {
		super(baseUrl);
	}

	get(route: string, query?: object) {
		return this.GET(route, query);
	}

	post(route: string, body?: object) {
		return this.POST(route, body);
	}

	put(route: string, body?: object) {
		return this.PUT(route, body);
	}

	delete(route: string, query?: object) {
		return this.DELETE(route, query);
	}
}

export default Client;