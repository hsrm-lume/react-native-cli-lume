import {
	GeoServiceSubscription,
	getFullscreenErrors,
	getPermission,
	getUserData,
	subscribePosition,
	registerErrorsChangeSubscription,
	handleError,
	remError,
} from '../services';
import {checkConnected} from '../services/InternetCheck';
import {useOnInit, UserData} from '../types';
import {GeoLocation} from '../types/GeoLocation';
import QRGenerator from '../components/qrGenerator';
import QRScanner from '../components/qrScanner';
import React, {useState, useEffect} from 'react';
import {StyleSheet, Text} from 'react-native';
import {LinearGradient} from 'react-native-svg';
import ErrorBar from '../components/error/errorBar';
import FullErrorView from '../components/error/fullErrorView';
import FireView from '../components/fire/fire';
import {FireOffLogic} from '../components/fire/fireOffLogic';
import {FireOnLogic} from '../components/fire/fireOnLogic';

export default function FireScreen() {
	// userData
	const [userData, userDataChange] = useState<Partial<UserData>>({});
	const fireStatusChange = (fs: boolean) => {
		console.log('setting fire to: ' + fs);
		userDataChange({uuid: userData.uuid, fireStatus: fs});
	};

	const [repaint, setRepaint] = useState(true);
	const repaintMainComponent = () => {
		setRepaint(!repaint);
	};
	registerErrorsChangeSubscription(repaintMainComponent);

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
	useEffect(() => {
		console.log('resubbing');
		let sub: GeoServiceSubscription;
		console.log('getting permission');
		getPermission('lume.permissons.location').then(() => {
			sub = subscribePosition(pos => {
				console.log(pos);
				posChange(pos);
			});
		});
		return () => {
			sub?.unsubscribe();
		};
	}, [repaint]);

	// TODO initial tech checks
	checkConnected().then(res => {
		if (!res) handleError('internet.device');
		else remError('internet.device');
	});
	// display errors if there is at least one
	const e = getFullscreenErrors()[0];
	if (e) return <FullErrorView item={e} />;

	// qrStatus
	var [qrStatus, setQrStatus] = useState(false);
	const switchQrStatus = () => {
		setQrStatus(!qrStatus);
	};

	// display fire view if no errors present
	return userData.uuid && userData.fireStatus !== undefined && pos ? (
		<LinearGradient
			colors={
				userData.fireStatus ? ['#ffffff', '#FF3A3A'] : ['#ffffff', '#6F3FAF']
			}
			style={styles.container}>
			{pos &&
			userData.uuid &&
			qrStatus !== undefined &&
			userData.fireStatus !== undefined ? ( // only render components if data ready
				userData.fireStatus ? (
					// fire on
					qrStatus ? (
						// render QR Code Generator
						<QRGenerator
							uid={userData.uuid}
							position={pos}
							updateQrStatus={switchQrStatus}
						/>
					) : (
						// render fire components and QR button
						<>
							<FireView
								fire={userData.fireStatus}
								updateQrStatus={switchQrStatus}
							/>
							<FireOnLogic uuid={userData.uuid} location={pos} />
						</>
					)
				) : // fire off
				qrStatus ? (
					// render QR Code Scanner
					<QRScanner
						uid={userData.uuid}
						position={pos}
						updateQrStatus={switchQrStatus}
					/>
				) : (
					// render fire components and QR button
					<>
						<FireView
							fire={userData.fireStatus}
							updateQrStatus={switchQrStatus}
						/>
						<FireOffLogic
							userData={{
								uuid: userData.uuid,
								fireStatus: userData.fireStatus,
							}}
							fireUpdater={fireStatusChange}
							location={pos}
						/>
					</>
				)
			) : (
				/* TODO: Loading view */
				<Text style={styles.text1}>Loading...</Text>
			)}
			<ErrorBar />
		</LinearGradient>
	) : null;
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
	qrCode: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		containerMap: {
			width: '100%',
			height: '100%',
		},
	},
});
