import Geolocation, {GeoWatchOptions} from 'react-native-geolocation-service';
import {environment} from '../env/environment';
import {GeoLocation} from '../types/GeoLocation';

/**
 * Wrapper class to unsubscribe from the GeoLocation watch
 */
class GeoServiceSubscription {
	constructor(private n: number) {}
	public unsubscribe() {
		Geolocation.clearWatch(this.n);
	}
}

/**
 * Static options for Geolocation.watchPosition
 */
const watchOptions: GeoWatchOptions = {
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

/**
 * Internal callback to filter low accuracy poisitions
 * @param position to be passed to callback
 * @param cb callback accepting the position
 */
const internalCallback = (
	position: Geolocation.GeoPosition,
	cb: (pos: GeoLocation) => void
) => {
	if (position.coords.accuracy < environment.GEO_THRESHOLD) return; // TODO error handler
	cb({
		accuracy: position.coords.accuracy,
		lat: position.coords.latitude,
		lng: position.coords.longitude,
	});
};

/**
 * @param callback callback accepting the detected position
 * @returns GeoServiceSubscription to unsubscribe later
 */
const subscribe = (
	callback: (pos: GeoLocation) => void
): GeoServiceSubscription => {
	const n = Geolocation.watchPosition(
		pos => internalCallback(pos, callback),
		() => {
			// TODO error handler
			console.warn('Geolocation.watchPosition error');
		},
		watchOptions
	);
	return new GeoServiceSubscription(n);
};

export default subscribe;
