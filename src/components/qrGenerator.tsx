import React from 'react';
import {View, StyleSheet, TouchableHighlight} from 'react-native';
import {TransmissionData, GeoLocation} from '../types';
import QRCode from 'react-native-qrcode-svg';
import Close from '../assets/close.svg';

const QRGenerator = (props: {
	uid: string;
	position: GeoLocation;
	updateQrStatus: () => void;
}) => {
	const tmd: TransmissionData = {
		uuid: props.uid,
		location: props.position,
	};
	const data = JSON.stringify(tmd);
	console.log('QR Code Data: ' + data);

	return (
		<View style={styles.container}>
			<TouchableHighlight
				style={styles.closeWindow}
				underlayColor="#EEEEEE"
				onPress={props.updateQrStatus}>
				<Close width={50} height={50} />
			</TouchableHighlight>
			<View style={styles.qrCode}>
				<QRCode
					size={250}
					value={data}
					onError={() => console.warn('Error in QR Generator')}
				/>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		backgroundColor: '#EEEEEE',
		top: '2%',
		bottom: '2%',
		left: '4%',
		right: '4%',
		borderRadius: 30,
		position: 'absolute',
		opacity: 1,
		paddingBottom: 25,
	},
	qrCode: {
		flex: 1,
		justifyContent: 'center',
	},
	closeWindow: {
		alignSelf: 'flex-end',
	},
});

export default QRGenerator;
