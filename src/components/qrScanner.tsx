import React from 'react';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {environment} from '../env/environment';
import {RestClient, writeUserData} from '../services';
import {TransmissionData, GeoLocation, HandledPromise} from '../types';

const QRScanner = (props: {
	uid: string;
	position: GeoLocation;
	updateQrStatus: () => void;
}) => {
	return (
		<QRCodeScanner
			onRead={event => {
				// validation
				new HandledPromise<[TransmissionData, TransmissionData]>(resolve => {
					if (!props.uid) throw new Error('Torch not yet ready');
					if (!props.position) throw new Error('Position not accurate enough');
					if (!event.data) throw new Error('QR Code is invalid');
					var self: TransmissionData;
					var received: TransmissionData;
					try {
						self = {
							uuid: props.uid,
							location: props.position,
						};
						received = JSON.parse(event.data);
					} catch (error) {
						throw new Error('QR Code is invalid');
					}
					resolve([self, received]);
				}).then(([self, received]) => {
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
					).then(() => {
						// fs -> realm
						writeUserData({fireStatus: true});
					});
				});
				props.updateQrStatus();
			}}
		/>
	);
};

export default QRScanner;
