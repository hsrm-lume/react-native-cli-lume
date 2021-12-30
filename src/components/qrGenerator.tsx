import React from 'react';
import {View, StyleSheet, TouchableHighlight, Text} from 'react-native';
import {GeoLocation} from '../types';
import {QrCodeData} from '../types/QrCodeData';
import QRCode from 'react-native-qrcode-svg';
import Close from '../assets/close.svg';

const QRGenerator = (props: {
	uid: string;
	position: GeoLocation;
	updateQrStatus: () => void;
}) => {
	const qrData: QrCodeData = {
		ts: Math.floor(Date.now() / 1000),
		uuid: props.uid,
		location: props.position,
	};
	const data = JSON.stringify(qrData);
	return (
		<>
			<View style={styles.headlineBox}>
				<Text style={styles.headlineText}>SHARE YOUR FIRE!</Text>
			</View>
			<View style={styles.window}>
				<TouchableHighlight
					style={styles.closeWindow}
					underlayColor="#FFFFFF"
					onPress={props.updateQrStatus}>
					<Close width={50} height={50} />
				</TouchableHighlight>
				<View style={styles.qrCode}>
					<QRCode
						size={250}
						value={data}
						onError={
							() => console.warn('Error in QR Generator')
							/* TODO: ErrorHandler */
						}
					/>
				</View>
				<View style={styles.textBox}>
					<Text style={styles.text}>Share your lume QR-Code!</Text>
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

	qrCode: {
		paddingVertical: 45,
	},

	textBox: {
		alignItems: 'center',
		paddingBottom: 25,
	},

	text: {
		fontSize: 22,
		color: '#000000',
	},

	closeWindow: {
		alignSelf: 'flex-end',
	},
});

export default QRGenerator;
