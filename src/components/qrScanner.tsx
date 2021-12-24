import React from 'react';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {environment} from '../env/environment';
import {RestClient, writeUserData} from '../services';
import {GeoLocation, HandledPromise} from '../types';
import {QrCodeData} from '../types/QrCodeData';

const QRScanner = (props: {
	uid: string;
	position: GeoLocation;
	updateQrStatus: () => void;
}) => {
	return (
		<QRCodeScanner
			onRead={event => {
				// validation
				new HandledPromise<[QrCodeData, QrCodeData]>(resolve => {
					if (!props.uid) throw new Error('Torch not yet ready');
					if (!props.position) throw new Error('Position not accurate enough');
					if (!event.data) throw new Error('QR Code is empty');
					var self: QrCodeData;
					var received: QrCodeData;
					try {
						self = {
							ts: Math.floor(Date.now() / 1000),
							uuid: props.uid,
							location: props.position,
						};
						received = JSON.parse(event.data);
					} catch (error) {
						throw new Error('QR Code is invalid');
					}
					// check timestamp
					if (self.ts - received.ts > 10)
						throw new Error('QR Code is outdated');
					resolve([self, received]);
				})
					.then(([self, received]) =>
						// POST ApiData to REST API
						RestClient.postContact(
							environment.API_BASE_DOMAIN + environment.API_CONTACT_PATH,
							{
								uuidChild: self.uuid,
								uuidParent: received.uuid,
								position:
									self.location.accuracy < received.location.accuracy
										? self.location
										: received.location,
							}
						)
					)
					.then(() =>
						// fs -> realm
						writeUserData({fireStatus: true})
					);
				props.updateQrStatus();
			}}
		/>
	);
};

export default QRScanner;
