import {useEffect, useState} from 'react';
import {environment} from '../../env/environment';
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
	const [nfcReaderLoop, updateRead] = useState(false); // used to refresh NFC reader loop
	let didUnmount = false;
	const reReadNfc = () => {
		updateRead(!nfcReaderLoop);
	};
	// NFC read
	useEffect(() => {
		console.log('nfc read');
		nfcReadNext()
			.then(tmd => {
				console.log(tmd);
				return tmd;
			})
			.then(tmd => [
				tmd,
				{
					uuid: props.userData.uuid,
					location: props.location,
				} as TransmissionData,
			])
			.then(([received, self]) => {
				console.log('self+res', received, self);
				return [received, self];
			})
			.then(
				([received, self]) =>
					new HandledPromise<void>('internet.api', res => {
						RestClient.postContact(
							self.uuid,
							received.uuid,
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
			.catch(e => {
				console.log('Error', e);
			})
			.finally(() => {
				if (didUnmount) return; // dont do anything if component is unmounted
				getUserData().then(ud =>
					ud.fireStatus ? props.fireUpdater(ud.fireStatus) : null
				);
				reReadNfc();
			});
		return () => {
			console.log('unmounfig FOL');
			didUnmount = true;
			nfcCleanupRead();
		};
	}, [nfcReaderLoop]);
	return null;
}
