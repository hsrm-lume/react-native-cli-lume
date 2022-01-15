import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RestClient, writeUserData} from '../../services';
import {GeoLocation, HandledPromise} from '../../types';
import {QrCodeData} from '../../types/TranmissionData';
import ThinCross from '../../assets/thinCross.svg';
import {Icon} from '../error/icon';

const QRScanner = (props: {
	uid: string;
	position: GeoLocation;
	updateQrStatus: () => void;
}) => {
	return (
		<>
			<View style={styles.headlineBox}>
				<Text style={styles.headlineText}>ILLUMINATE YOUR FIRE!</Text>
			</View>
			<View style={styles.window}>
				<Icon
					icon={ThinCross}
					action={props.updateQrStatus}
					style={styles.closeWindow}
				/>
				<QRCodeScanner
					onRead={event => {
						// validation
						new HandledPromise<[QrCodeData, QrCodeData]>(
							'qr.invalid',
							resolve => {
								if (!props.uid) throw new Error('Torch not yet ready');
								if (!props.position)
									throw new Error('Position not accurate enough');
								if (!event.data) throw new Error('QR-Code is empty');
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
									throw new Error('QR-Code is invalid');
								}
								// check timestamp
								if (self.ts - received.ts > 10)
									throw new Error('QR-Code is outdated');
								resolve([self, received]);
							}
						)
							.then(([self, received]) =>
								// POST ApiData to REST API
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
							);
						props.updateQrStatus();
					}}
					containerStyle={styles.containerView}
					cameraStyle={styles.cameraView}
				/>
				<View style={styles.textBox}>
					<Text style={styles.text}>Scan a lume QR-Code!</Text>
				</View>
			</View>
		</>
	);
};

const styles = StyleSheet.create({
	headlineBox: {
		alignItems: 'center',
		paddingTop: 64,
	},
	headlineText: {
		fontFamily: 'Domus-Tilting',
		fontSize: 30,
		color: '#000000',
	},
	window: {
		alignItems: 'center',
		backgroundColor: '#FFFFFF',
		borderRadius: 30,
		height: 445,
		width: 331,
		marginTop: 35,
	},
	containerView: {
		marginTop: 0,
	},
	cameraView: {
		overflow: 'hidden',
		borderRadius: 20,
		height: 300,
		width: 250,
		alignSelf: 'center',
	},
	textBox: {
		alignItems: 'center',
		paddingBottom: 25,
	},
	text: {
		fontFamily: 'Nexusa-Next',
		fontSize: 22,
		color: '#000000',
	},
	closeWindow: {
		alignSelf: 'flex-end',
		width: '15%',
		height: '15%',
		paddingRight: '5%',
	},
});

export default QRScanner;
