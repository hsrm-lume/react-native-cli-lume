import {useEffect, useState} from 'react';
import {
	getUserData,
	nfcCleanupRead,
	nfcReadNext,
	RestClient,
	writeUserData,
} from '../services';
import {GeoLocation, TransmissionData, UserData} from '../types';

export function FireOffLogic(props: {
	location: GeoLocation;
	userData: UserData;
	fireUpdater: (b: boolean) => void;
}) {
	const [nfcReaderLoop, updateRead] = useState(false); // used to refresh NFC reader loop
	let didUnmount = false;
	const reReadNfc = () => {
		updateRead(!nfcReaderLoop);
	};
	// NFC read
	useEffect(() => {
		console.log('nfc read');
		nfcReadNext()
			.then(tmd => [
				tmd,
				{
					uuid: props.userData.uuid,
					location: props.location,
				} as TransmissionData,
			])
			.then(([received, self]) =>
				// -> REST
				RestClient.postContact(
					received.uuid,
					self.uuid,
					self.location.accuracy < received.location.accuracy
						? self.location
						: received.location
				)
			)
			.then(() =>
				// fs -> realm
				writeUserData({fireStatus: true})
			)
			.finally(() => {
				if (didUnmount) return; // dont do anything if component is unmounted
				getUserData().then(ud => props.fireUpdater(ud.fireStatus));
				reReadNfc();
			});
		return () => {
			didUnmount = true;
			nfcCleanupRead();
		};
	}, [nfcReaderLoop]);
	return null;
}
