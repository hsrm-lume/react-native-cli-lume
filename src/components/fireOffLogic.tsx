import {useEffect, useState} from 'react';
import {environment} from '../env/environment';
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
			.then(([recieved, self]) =>
				// -> REST
				RestClient.postContact(
					environment.API_BASE_DOMAIN + environment.API_CONTACT_PATH,
					{
						uuidChild: self.uuid,
						uuidParent: recieved.uuid,
						position:
							self.location.accuracy < recieved.location.accuracy
								? self.location
								: recieved.location,
					}
				)
			)
			.then(() =>
				// fs -> realm
				writeUserData({fireStatus: true})
			)
			.finally(() => {
				getUserData().then(ud => props.fireUpdater(ud.fireStatus));
				reReadNfc();
			});
		return () => {
			nfcCleanupRead();
		};
	}, [nfcReaderLoop]);
	return null;
}
