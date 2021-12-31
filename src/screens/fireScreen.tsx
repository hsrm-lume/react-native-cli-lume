import React, {useState} from 'react';
import {Permission, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {PERMISSIONS} from 'react-native-permissions';
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
		getPermission(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE as Permission).then(
			() => {
				sub = subscribePosition(pos => {
					console.log(pos);
					posChange(pos);
				});
			}
		);
		return () => {
			sub?.unsubscribe();
		};
	});

	// rendering
	return (
		<LinearGradient
			colors={
				userData.fireStatus ? ['#ffffff', '#FF3A3A'] : ['#ffffff', '#6F3FAF']
			}
			style={styles.container}>
			<FireView fire={userData.fireStatus || false} />
			<ErrorBar />
			{/* 			{
				pos && userData.fireStatus !== undefined && userData.uuid ? ( // only render logic if data ready
					Platform.OS == 'ios' ? ( // only start NFC if we are on Android
						userData.fireStatus ? ( // render fire logic dependent on fire state
							<FireOnLogic uuid={userData.uuid} location={pos} />
						) : (
							<FireOffLogic
								userData={{
									uuid: userData.uuid,
									fireStatus: userData.fireStatus,
								}}
								fireUpdater={fireStatusChange}
								location={pos}
							/>
						)
					) : null
				) : null /* TODO: Loading view */}
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
