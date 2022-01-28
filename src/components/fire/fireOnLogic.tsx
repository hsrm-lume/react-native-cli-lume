import {useEffect} from 'react';
import {CloseableHCESession, nfcStartWrite} from '../../services';
import {GeoLocation, HandledPromise, TransmissionData} from '../../types';

/**
 * Functional component for logic to run, when the fire is on
 * @param props location and uuid to be emitted via NFC
 */
export function FireOnLogic(props: {location: GeoLocation; uuid: string}) {
	// NFC write
	useEffect(() => {
		let nfcWriteSession: CloseableHCESession | undefined;

		// start a new promise chain
		new HandledPromise<TransmissionData>('nfc.write', resolve => {
			resolve({
				uuid: props.uuid,
				location: props.location,
			});
		})
			// start NFC write session with data from the begin of the promise chain
			.then(tmd => nfcStartWrite(tmd, nfcWriteSession))
			// update the session variable
			.then(x => (nfcWriteSession = x));

		return () => {
			// cancel session on unmount
			nfcWriteSession?.close();
		};
	}, [props.location.lat, props.location.lng, props.location, props.uuid]);
	return null;
}
