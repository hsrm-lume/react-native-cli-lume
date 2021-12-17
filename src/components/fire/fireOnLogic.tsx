import {useEffect} from 'react';
import {CloseableHCESession, nfcStartWrite} from '../../services';
import {GeoLocation, HandledPromise, TransmissionData} from '../../types';

export function FireOnLogic(props: {location: GeoLocation; uuid: string}) {
	let nfcWriteSession: CloseableHCESession | undefined;
	// NFC write
	useEffect(() => {
		new HandledPromise<TransmissionData>(resolve => {
			resolve({
				uuid: props.uuid,
				location: props.location,
			});
		})
			.then(tmd => nfcStartWrite(tmd, nfcWriteSession))
			.then(x => (nfcWriteSession = x));

		return () => {
			nfcWriteSession?.close();
		};
	}, [props.location.lat, props.location.lng]);
	return null;
}
