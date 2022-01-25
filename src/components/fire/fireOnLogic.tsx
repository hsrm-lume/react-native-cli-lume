import {useEffect} from 'react';
import {CloseableHCESession, nfcStartWrite} from '../../services';
import {GeoLocation, HandledPromise, TransmissionData} from '../../types';

export function FireOnLogic(props: {location: GeoLocation; uuid: string}) {
	// NFC write
	useEffect(() => {
		let nfcWriteSession: CloseableHCESession | undefined;

		new HandledPromise<TransmissionData>('nfc.write', resolve => {
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
	}, [props.location.lat, props.location.lng, props.location, props.uuid]);
	return null;
}
