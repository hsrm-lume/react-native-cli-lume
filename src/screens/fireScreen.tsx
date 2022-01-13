import {
	GeoServiceSubscription,
	getPermission,
	getUserData,
	subscribePosition,
	handleError,
	remError,
	isNfcEnabled,
} from '../services';
import {checkConnected} from '../services/InternetCheck';
import {UserData} from '../types';
import {GeoLocation} from '../types/GeoLocation';
import QRGenerator from '../components/qr/qrGenerator';
import QRScanner from '../components/qr/qrScanner';
import React, {useState, useEffect} from 'react';
import {Platform, StyleSheet} from 'react-native';
import ErrorBar from '../components/error/errorBar';
import FireView from '../components/fire/fire';
import {FireOffLogic} from '../components/fire/fireOffLogic';
import {FireOnLogic} from '../components/fire/fireOnLogic';
import LinearGradient from 'react-native-linear-gradient';
import FullscreenErrors from '../components/error/fullscreenErrors';
import FullErrorView from '../components/error/fullErrorView';

export default function FireScreen() {
	// userData
	const [userData, userDataChange] = useState<Partial<UserData>>({});
	const fireStatusChange = (fs: boolean) => {
		console.log('setting fire to: ' + fs);
		userDataChange({uuid: userData.uuid, fireStatus: fs});
	};

	const [retryAfterError, doRetryAfterError] = useState(true);
	const doRetry = () => {
		console.log('repaint triggered');
		doRetryAfterError(!retryAfterError);
	};

	useEffect(() => {
		getUserData().then(ud => {
			if (ud.fireStatus == userData.fireStatus && ud.uuid == userData.uuid)
				return; // no change if values already match
			userDataChange(ud);
			console.log('fetched', ud);
		});
	}, [retryAfterError]);

	const [posPermission, setPosPermission] = useState<boolean | undefined>(
		undefined
	);
	useEffect(() => {
		console.log('try get perm');
		getPermission('lume.permissons.location').then(() => {
			setPosPermission(true);
			remError('location.permission');
		});
	}, [retryAfterError]);

	useEffect(() => {
		console.log('try nfc on');
		isNfcEnabled().then(() => remError('nfc.off'));
	}, [retryAfterError]);

	// position
	const [pos, posChange] = useState<GeoLocation | undefined>(undefined);
	useEffect(() => {
		if (!posPermission) {
			console.log(posPermission);
			return;
		}
		let sub: GeoServiceSubscription;
		sub = subscribePosition(pos => {
			console.log(pos);
			posChange(pos);
		});
		return () => {
			sub?.unsubscribe();
		};
	}, [posPermission, retryAfterError]);

	// TODO initial tech checks
	checkConnected().then(res => {
		if (!res) handleError('internet.device');
		else remError('internet.device');
	});

	// qrStatus
	const [qrStatus, setQrStatus] = useState(false);
	const switchQrStatus = () => {
		setQrStatus(!qrStatus);
	};

	// display fire view if no errors present
	return (
		<>
			<FullscreenErrors action={doRetry} />
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
								{Platform.OS == 'android' ? (
									<FireOnLogic uuid={userData.uuid} location={pos} />
								) : null}
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
							{Platform.OS == 'android' ? (
								<FireOffLogic
									userData={{
										uuid: userData.uuid,
										fireStatus: userData.fireStatus,
									}}
									fireUpdater={fireStatusChange}
									location={pos}
								/>
							) : null}
						</>
					)
				) : (
					<FullErrorView item="loading" action={null}></FullErrorView>
				)}
				<ErrorBar />
			</LinearGradient>
		</>
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
	qrCode: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
});
