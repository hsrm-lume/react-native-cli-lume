import React from 'react';
import QRCode from 'react-native-qrcode-svg';
import {TransmissionData, GeoLocation} from '../types';

const QRGenerator = (props: {uid: string; position: GeoLocation}) => {
	const tmd: TransmissionData = {
		uuid: props.uid,
		location: props.position,
	};
	const data = JSON.stringify(tmd);
	console.log('QR Code Data: ' + data);
	return (
		<QRCode
			size={200}
			value={data}
			onError={() => console.log('Error in QR Generator')}
		/>
	);
};

export default QRGenerator;
