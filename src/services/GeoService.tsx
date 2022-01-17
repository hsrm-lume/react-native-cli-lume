import Geolocation, {GeoWatchOptions} from 'react-native-geolocation-service';
import {handleError, remError} from '.';
import {environment} from '../env/environment';
import {GeoLocation} from '../types/GeoLocation';

/**
 * Wrapper class to unsubscribe from the GeoLocation watch
 */
export class GeoServiceSubscription {
	constructor(private n: number) {}
	public unsubscribe() {
		Geolocation.clearWatch(this.n);
	}
}

/**
 * Index to count how often the accuracy is too bad
 */
class GeoAccuracyIterator {
	private failIndex = 0;
	private okIndex = 0;
	isFine(): boolean | undefined {
		// two fails allowed before error is shown.
		if(this.failIndex >= 2) return false;
		if(this.okIndex < 2) return undefined;
		return true;
	}
	fail() {
		this.failIndex++;
		this.okIndex = 0;
	}
	ok() {
		this.okIndex++;
		this.failIndex = 0;
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
 * Internal callback to filter bad accuracy positions
 * @param position to be passed to callback
 * @param cb callback accepting the position
 */
const internalCallback = (
	position: Geolocation.GeoPosition,
	cb: (pos: GeoLocation) => void,
	iterator: GeoAccuracyIterator
) => {
	remError('location.device'); // if a position gets reported, geo has to be working

	if (position.coords.accuracy > environment.GEO_THRESHOLD) iterator.fail();
	else iterator.ok();

	// perform actions dependent on iterator isFine state
	if (iterator.isFine()){
		remError('location.accuracy');
		cb({
			accuracy: position.coords.accuracy,
			lat: position.coords.latitude,
			lng: position.coords.longitude,
		});
	} else if(iterator.isFine() === false) {
		handleError('location.accuracy');
	}
};

/**
 * @param callback callback accepting the detected position
 * @returns GeoServiceSubscription to unsubscribe later
 */
export const subscribePosition = (
	callback: (pos: GeoLocation) => void
): GeoServiceSubscription => {
	const iterator = new GeoAccuracyIterator();
	const n = Geolocation.watchPosition(
		pos => internalCallback(pos, callback, iterator),
		e => {
			handleError('location.device');
			console.warn('Geolocation.watchPosition error', e);
		},
		watchOptions
	);
	return new GeoServiceSubscription(n);
};
