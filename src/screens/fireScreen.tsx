import React, {useState} from 'react';
import {StyleSheet, Pressable, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ErrorBar from '../components/errorBar';
import FireView from '../components/fire';
import {FireOffLogic} from '../components/fireOffLogic';
import {FireOnLogic} from '../components/fireOnLogic';
import {
	GeoServiceSubscription,
	getPermission,
	getUserData,
	subscribePosition,
} from '../services';
import {useOnInit, UserData} from '../types';
import {GeoLocation} from '../types/GeoLocation';
import QRScanner from '../components/qrScanner';

export default function FireScreen() {
	// userData
	const [userData, userDataChange] = useState<Partial<UserData>>({});
	const fireStatusChange = (fs: boolean) => {
		console.log('setting fire to: ' + fs);
		userDataChange({uuid: userData.uuid, fireStatus: fs});
	};
	useOnInit(() => {
		getUserData().then(ud => {
			if (ud.fireStatus == userData.fireStatus && ud.uuid == userData.uuid)
				return; // no change if values already match
			userDataChange(ud);
			console.log('fetched', ud);
		});
	});

	// position
	const [pos, posChange] = useState<GeoLocation | undefined>(undefined);
	useOnInit(() => {
		let sub: GeoServiceSubscription;
		console.log('getting permission');
		getPermission('android.permission.ACCESS_FINE_LOCATION').then(() => {
			sub = subscribePosition(pos => {
				posChange(pos);
			});
		});
		return () => {
			sub?.unsubscribe();
		};
	});

	// qrStatus
	var [qrStatus, setQrStatus] = useState(false);
	const switchQrStatus = () => {
		setQrStatus(!qrStatus);
	};

	// rendering
	return (
		<LinearGradient
			colors={
				userData.fireStatus ? ['#ffffff', '#FF3A3A'] : ['#ffffff', '#6F3FAF']
			}
			style={styles.container}>
			<FireView fire={userData.fireStatus || false} />
			<ErrorBar />
			{ /* TODO: Error when rendering FireView and QR components together */
				userData.fireStatus !== undefined && qrStatus !== undefined 
					&& pos && userData.uuid ? ( // only render logic if data ready
					qrStatus ? ( // render QR component or Pressable dependent on qrStatus
						userData.fireStatus ? (
							null /* TODO: QR Code Generator */
						) : (
							<QRScanner uid={userData.uuid} position={pos} />
						)
					) : (
						userData.fireStatus ? (
								<Pressable onPress={switchQrStatus}>
									<Text style={styles.text1}>Generate QR Code</Text>
								</Pressable>
							
						) : (
								<Pressable onPress={switchQrStatus}>
									<Text style={styles.text1}>Scan QR Code</Text>
								</Pressable>
						)
					)
				) : null /* TODO: Loading view */
			}
			{
				pos && userData.fireStatus !== undefined && userData.uuid ? ( // only render logic if data ready
					userData.fireStatus ? ( // render fire logic dependent on fire state
						<FireOnLogic uuid={userData.uuid} location={pos} />
					) : (
						<FireOffLogic
							userData={{uuid: userData.uuid, fireStatus: userData.fireStatus}}
							fireUpdater={fireStatusChange}
							location={pos}
						/>
					)
				) : null /* TODO: Loading view */
			}
		</LinearGradient>
	);
}

const styles = StyleSheet.create({
	container: {
		height: '100%',
		alignItems: 'center',
	},
	text1: {
		fontSize: 30,
		color: '#000000',
	},
	button: {
		height: '10%',
		width: '70%',
		backgroundColor: '#abb0ba',
		borderRadius: 10,
		alignItems: 'center',
		justifyContent: 'center',
	},
});
