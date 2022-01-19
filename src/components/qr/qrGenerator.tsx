import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {GeoLocation} from '../../types';
import {QrCodeData} from '../../types/TranmissionData';
import QRCode from 'react-native-qrcode-svg';
import ThinCross from '../../assets/thinCross.svg';
import {Icon} from '../error/icon';
import {handleError} from '../../services/ErrorHandler';

/**
 * @param uid uuid of current user
 * @param position position of current user
 * @param updateQrStatus callback to close QRGenerator
 */
const QRGenerator = (props: {
	uid: string;
	position: GeoLocation;
	updateQrStatus: () => void;
}) => {
	// initialize data to be written into QR-Code
	const qrData: QrCodeData = {
		ts: Math.floor(Date.now() / 1000),
		uuid: props.uid,
		location: props.position,
	};
	// convert json object to string
	const data = JSON.stringify(qrData);
	return (
		<>
			<View style={styles.headlineBox}>
				<Text style={styles.headlineText}>SHARE YOUR FIRE!</Text>
			</View>
			<View style={styles.window}>
				<Icon
					icon={ThinCross}
					action={props.updateQrStatus}
					style={styles.closeWindow}
				/>
				<View style={styles.qrCode}>
					<QRCode
						size={250}
						value={data}
						onError={() => handleError('qr.invalid')}
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
	qrCode: {
		paddingVertical: 45,
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
		width: '13%',
		height: '13%',
		paddingRight: '5%',
	},
});

export default QRGenerator;
