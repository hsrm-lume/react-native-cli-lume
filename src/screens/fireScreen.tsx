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
import {useNavigation} from '@react-navigation/native';

export default function FireScreen(props: any) {
	// repaint this component and rerun all checks on doRetry calls
	const [retryAfterError, doRetryAfterError] = useState(true);
	const doRetry = () => {
		console.log('repaint triggered');
		doRetryAfterError(!retryAfterError);
	};

	// userData
	const [userData, userDataChange] = useState<Partial<UserData>>({});
	const fireStatusChange = (fs: boolean) => {
		console.log('setting fire to: ' + fs);
		userDataChange({
			uuid: userData.uuid,
			fireStatus: fs,
			firstAppUse: userData.firstAppUse,
		});
	};
	// load the userData from Realm when the component is mounted
	useEffect(() => {
		getUserData().then(ud => {
			if (
				ud.fireStatus === userData.fireStatus &&
				ud.uuid === userData.uuid &&
				ud.firstAppUse === userData.firstAppUse
			)
				return; // no change if values already match
			userDataChange(ud);
			console.log('fetched', ud);
		});
	}, [
		retryAfterError,
		userData.fireStatus,
		userData.firstAppUse,
		userData.uuid,
	]);

	// navigate to the IntroScreen on first app use
	const navigation = useNavigation();
	useEffect(() => {
		if (userData.firstAppUse === true)
			// @ts-ignore: react navigation does not know how to use itself
			navigation.navigate('IntroScreen');
	});
	if (props.route.params?.returningFromIntro) {
		// @ts-ignore: react navigation does not know how to use itself
		props.route.params.returningFromIntro = false;
		console.log('returning from intro');
		console.log('userDataIs', userData);
		doRetry();
	}

	////// TECHNOLOGIES CHECK //////
	// check if position is permitted and a position is reported
	const [posPermission, setPosPermission] = useState<boolean | undefined>(
		undefined
	);
	useEffect(() => {
		console.log('try to get pos permission', userData, userData.firstAppUse);
		if (userData.firstAppUse !== false) return;
		console.log('try get perm');
		getPermission('lume.permissons.location').then(() => {
			setPosPermission(true);
			remError('location.permission');
		});
	}, [retryAfterError, userData.firstAppUse]);

	// check if nfc is on
	useEffect(() => {
		console.log('try nfc on');
		isNfcEnabled().then(() => remError('nfc.off'));
	}, [retryAfterError]);

	// check if internet is reachable
	checkConnected().then(res => {
		if (!res) handleError('internet.device');
		else remError('internet.device');
	});

	// position subscription
	const [pos, posChange] = useState<GeoLocation | undefined>(undefined);
	useEffect(() => {
		if (!posPermission) {
			console.log(posPermission);
			return;
		}
		let sub: GeoServiceSubscription;
		sub = subscribePosition(posUpdate => {
			console.log(posUpdate);
			posChange(posUpdate);
		});
		return () => {
			sub?.unsubscribe();
		};
	}, [posPermission, retryAfterError]);

	// toggle for the qr scanner/code
	const [qrStatus, setQrStatus] = useState(false);
	const switchQrStatus = () => {
		setQrStatus(!qrStatus);
	};

	return (
		<>
			{/* Show the full screen errors wrapper component above all others */}
			<FullscreenErrors action={doRetry} />
			<LinearGradient
				colors={
					userData.fireStatus ? ['#ffffff', '#FF3A3A'] : ['#ffffff', '#6F3FAF']
				}
				style={styles.container}>
				{pos &&
				userData.uuid &&
				qrStatus !== undefined &&
				userData.fireStatus !== undefined &&
				userData.firstAppUse !== undefined ? ( // only render components if data ready
					userData.fireStatus ? ( // do render dependent on fire status
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
								{Platform.OS === 'android' ? (
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
							{Platform.OS === 'android' ? (
								<FireOffLogic
									userData={{
										uuid: userData.uuid,
										fireStatus: userData.fireStatus,
										firstAppUse: userData.firstAppUse,
									}}
									fireUpdater={fireStatusChange}
									location={pos}
								/>
							) : null}
						</>
					)
				) : (
					// display an error view if not all data is present but tech checks passed
					<FullErrorView item="loading" action={null} />
				)}
				{/* Error bar for showing dismissable errors */}
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
});
