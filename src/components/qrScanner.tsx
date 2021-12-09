import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {BarCodeReadEvent} from 'react-native-camera';

const onSuccess = (e: BarCodeReadEvent) => {
	console.log(e.data);
};

const QRScanner = () => {
	return (
		<QRCodeScanner
			onRead={onSuccess}
			topContent={
				<View>
					<Text style={styles.Text}>
						Scan a QR Code from a different phone with an active fire
					</Text>
				</View>
			}
		/>
	);
};

const styles = StyleSheet.create({
	Text: {
		textAlign: 'center',
	},
});

export default QRScanner;
