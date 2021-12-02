import Geolocation from 'react-native-geolocation-service';
import {GeoLocation} from '../types/geoLocation';

const worstAccuracy = 10000;

class GeoService {
	bestAccuracy: number;
	watchId: number;
	watchOptions: Geolocation.GeoWatchOptions;

	constructor() {
		this.bestAccuracy = worstAccuracy;
		this.watchId = 0;
		this.watchOptions = {
			accuracy: {
				android: 'high',
				ios: 'best',
			},
			enableHighAccuracy: true,
			distanceFilter: 0,
			interval: 10000,
			fastestInterval: 2000,
			showLocationDialog: true,
			forceRequestLocation: false,
			forceLocationManager: false,
		};
	}

	successCallback(position: Geolocation.GeoPosition) {
		const currentAccuracy = position.coords.accuracy;

		if (currentAccuracy < this.bestAccuracy) {
			this.bestAccuracy = currentAccuracy;
			const res: GeoLocation = {
				accuracy: currentAccuracy.toString(),
				lat: position.coords.latitude.toString(),
				lng: position.coords.longitude.toString(),
			};
			console.log(res);
			// update nfc data
		}
	}

	errorCallback(error: Geolocation.GeoError) {
		console.log(error);
	}

	watchLocation() {
		this.bestAccuracy = worstAccuracy;
		const success = this.successCallback.bind(this);
		const error = this.errorCallback.bind(this);
		this.watchId = Geolocation.watchPosition(success, error, this.watchOptions);
	}

	stopWatching() {
		Geolocation.clearWatch(this.watchId);
	}
}

export default GeoService;
