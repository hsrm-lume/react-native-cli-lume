import Geolocation, {GeoWatchOptions} from 'react-native-geolocation-service';
import {handleError, remError} from '.';
import {environment} from '../env/environment';
import {GeoLocation} from '../types/GeoLocation';

/**
 * Wrapper class to unsubscribe from the GeoLocation watch
 */
export class GeoServiceSubscription {
	constructor(private watch: number) {}
	public unsubscribe() {
		Geolocation.clearWatch(this.watch);
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
		if (this.failIndex >= 2) return false;
		if (this.okIndex < 2) return undefined;
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
	interval: 5000,
	fastestInterval: 1000,
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

	// report to the iterator if the accuracy is fine
	if (position.coords.accuracy > environment.GEO_THRESHOLD) iterator.fail();
	else iterator.ok();

	// perform actions dependent on iterator isFine state
	if (iterator.isFine()) {
		remError('location.accuracy'); // acurracy has to be accurate enough if we are here
		// execute callback function given by the subscriber with GeoLocation as parameter
		cb({
			accuracy: position.coords.accuracy,
			lat: position.coords.latitude,
			lng: position.coords.longitude,
		});
	} else if (iterator.isFine() === false) handleError('location.accuracy'); // else add the accuracy error
};

/**
 * @param callback callback accepting the detected position
 * @returns GeoServiceSubscription to unsubscribe later
 */
export const subscribePosition = (
	callback: (pos: GeoLocation) => void
): GeoServiceSubscription => {
	// generate a sepearate iterator for each subscription
	const iterator = new GeoAccuracyIterator();
	// subscribe the position
	const watch = Geolocation.watchPosition(
		// on report, first do the wrapping internal callback to check if the accuracy is fine
		pos => internalCallback(pos, callback, iterator),
		e => {
			// on error getting position, add the error to the error handler
			handleError('location.device');
			console.warn('Geolocation.watchPosition error', e);
		},
		watchOptions
	);
	// wrap the subscription in a class to be able to unsubscribe later
	return new GeoServiceSubscription(watch);
};
