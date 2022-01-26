import {useEffect, useState} from 'react';
import {
	getUserData,
	nfcCleanupRead,
	nfcReadNext,
	RestClient,
	writeUserData,
} from '../../services';
import {
	GeoLocation,
	HandledPromise,
	TransmissionData,
	UserData,
} from '../../types';

/**
 * Functional component for logic to run, when the fire is off
 */
export function FireOffLogic(props: {
	location: GeoLocation;
	userData: UserData;
	fireUpdater: (b: boolean) => void;
}) {
	// deconstruct props
	const {location, userData, fireUpdater} = props;

	const [nfcReaderLoop, updateRead] = useState(false); // used to refresh NFC reader loop

	// NFC reader loop
	useEffect(() => {
		let didUnmount = false; // used to prevent further processing after the component got unmounted

		console.log('nfc read');
		// get next NFC tag
		nfcReadNext()
			// zip retrieved data with data of this device
			.then(tmd => [
				tmd,
				{
					uuid: userData.uuid,
					location: location,
				} as TransmissionData,
			])
			// send data to server
			.then(
				([received, self]) =>
					new HandledPromise<void>('internet.api', res => {
						RestClient.postContact(
							received.uuid,
							self.uuid,
							self.location.accuracy < received.location.accuracy
								? self.location
								: received.location
						).then(res);
					})
			)
			// update fire status in the Realm
			.then(
				() =>
					new HandledPromise<void>('storage', res => {
						writeUserData({fireStatus: true}).then(() => res());
					})
			)
			.finally(() => {
				// dont do anything if component is unmounted
				if (didUnmount) return;
				// fetch previously saved user data from Realm
				// decide if we got in finally becaues of an error or a successful request
				getUserData().then(ud =>
					// run the update callback
					ud.fireStatus ? fireUpdater(ud.fireStatus) : null
				);
				// trigger rerender of NFC reader loop
				updateRead(!nfcReaderLoop);
			});
		return () => {
			// mark component as unmounted and stop NFC reader session
			didUnmount = true;
			nfcCleanupRead();
		};
	}, [nfcReaderLoop, location, fireUpdater, userData]);
	return null;
}
