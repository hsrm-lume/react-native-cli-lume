import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {BarCodeReadEvent} from 'react-native-camera';
import {environment} from '../env/environment';
import {RestClient, writeUserData, getUserData} from '../services';
import {TransmissionData} from '../types/TranmissionData';
import {useOnInit} from '../types/useOnInit';
import {UserData} from '../types/UserData';

const onSuccess = (navigation, e: BarCodeReadEvent, ud: UserData) => {
	const data = e.data;
	console.log('received:' + data);
	console.log('self.uuid:' + ud.uuid);
	const self: TransmissionData = {
		uuid: ud.uuid,
		location: {
			accuracy: 8,
			lat: 50.084499,
			lng: 8.249767,
		},
	};
	const received: TransmissionData = {
		uuid: '9b1deb4d-efgh-abcd-abcd-2b0d7b3dcb6d',
		location: {
			accuracy: 20,
			lat: 50.084499,
			lng: 8.249767,
		},
	};

	// check if QR code is valid


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
		.then(() => {
			// fs -> realm
			writeUserData({fireStatus: true});
		})
		.catch(error => console.log('error reading qr code:', error));

	// open the fireScreen
	navigation.navigate('Fire');
};

const QRScanner = ({navigation}) => {
	const [userData, userDataChange] = useState<UserData | undefined>(undefined);
	useEffect(() => {
		console.log('läuft');
		getUserData().then(ud => {
			if (ud.fireStatus === userData?.fireStatus && ud.uuid === userData?.uuid)
				return; // no change if values already match
			userDataChange(ud);
			console.log('fetched', ud);
		});
	}, []);

	return (
		<QRCodeScanner
			onRead={event =>
				onSuccess(navigation, event, {
					uuid: userData.uuid || '',
					fireStatus: userData.fireStatus || false,
				})
			}
			topContent={
				<View>
					<Text style={styles.Text}>
						Scan a QR Code from an other phone with an active fire
					</Text>
				</View>
			}
		/>
	);
};

const styles = StyleSheet.create({
	Text: {
		textAlign: 'center',
<<<<<<< HEAD
		fontSize: 20,
		color: 'black',
		marginTop: -20,
=======
>>>>>>> configure QR Code Scanner
	},
});

export default QRScanner;
