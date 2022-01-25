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

export function FireOffLogic(props: {
	location: GeoLocation;
	userData: UserData;
	fireUpdater: (b: boolean) => void;
}) {
	const {location, userData, fireUpdater} = props;

	const [nfcReaderLoop, updateRead] = useState(false); // used to refresh NFC reader loop
	// NFC read
	useEffect(() => {
		let didUnmount = false;
		const reReadNfc = () => {
			updateRead(!nfcReaderLoop);
		};

		console.log('nfc read');
		nfcReadNext()
			.then(tmd => [
				tmd,
				{
					uuid: userData.uuid,
					location: location,
				} as TransmissionData,
			])
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
			.then(
				() =>
					new HandledPromise<void>('storage', res => {
						writeUserData({fireStatus: true}).then(() => res());
					})
			)
			.then(() =>
				// fs -> realm
				writeUserData({fireStatus: true})
			)
			.finally(() => {
				if (didUnmount) return; // dont do anything if component is unmounted
				getUserData().then(ud =>
					ud.fireStatus ? fireUpdater(ud.fireStatus) : null
				);
				reReadNfc();
			});
		return () => {
			didUnmount = true;
			nfcCleanupRead();
		};
	}, [nfcReaderLoop, location, fireUpdater, userData]);
	return null;
}
