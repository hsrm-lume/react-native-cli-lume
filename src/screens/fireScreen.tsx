import {resolveObjectURL} from 'buffer';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {PermissionsAndroid, StyleSheet, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import DebugBar from '../components/debugBar';
import ErrorBar from '../components/errorBar';
import FireView from '../components/fire';
import WebErrorView from '../components/webErrorView';
import {environment} from '../env/environment';
import {
	CloseableHCESession,
	GeoServiceSubscription,
	getPermission,
	getUserData,
	nfcReadNext,
	nfcStartWrite,
	RestClient,
	subscribePosition,
	writeUserData,
} from '../services';
import ErrorHandler from '../services/ErrorHandler';
import ErrorMessage from '../services/ErrorMessage';
import { checkConnected } from '../services/InternetCheck';
import {GeoLocation} from '../types/GeoLocation';
import {HandledPromise} from '../types/HandledPromise';
import {TransmissionData} from '../types/TranmissionData';
import {useOnDepUpdate} from '../types/useOnDepUpdate';
import {useOnInit} from '../types/useOnInit';

export default function FireScreen() {
	var [bigSize, setBigSize] = useState(false);
	var [render, setRender] = useState(1);
	var countMsg = 0;

	const switchBigSize = () => {
		bigSize = !bigSize;
		setBigSize(bigSize);
	};
	const remError = useCallback((msg: ErrorMessage) => {
		render = render - 1;
		setRender(render);
		ErrorHandler.remError(msg);
		countMsg -= 1;
	}, []);
	/***************************************************************************************************************************************************************************************************** */
	const [nfcReaderLoop, updateRead] = useState(false); // used to refresh NFC reader loop
	const reReadNfc = () => {
		updateRead(!nfcReaderLoop);
	};
	// NFC read
	useOnDepUpdate(() => {
		console.log('nfc read');
		nfcReadNext()
			.then(
				tmd =>
					// validation
					new HandledPromise<[TransmissionData, TransmissionData]>(resolve => {
						if (!uuid.current) throw new Error('Torch not yet ready');
						if (!location.current)
							throw new Error('Position not accurate enough');
						resolve([
							tmd,
							{
								uuid: uuid.current,
								location: location.current,
							} as TransmissionData,
						]);
					})
			)
			.then(([recieved, self]) =>
				// -> REST
				RestClient.postContact(
					environment.API_BASE_DOMAIN + environment.API_CONTACT_PATH,
					{
						uuidChild: self.uuid,
						uuidParent: recieved.uuid,
						position:
							self.location.accuracy < recieved.location.accuracy
								? self.location
								: recieved.location,
					}
				)
			)
			.then(() => {
				// fs -> realm
				writeUserData({fireStatus: true});
			})
			.catch(e => console.log('error reading next nfc:', e))
			.finally(async () => {
				getUserData().then(ud => {
					console.log(ud.fireStatus);
					console.log(nfcReaderLoop);
					if (ud.fireStatus === false) {
						reReadNfc();
					} else {
						reWriteNfc();
					}
				});
			});
		return () => {};
	}, [nfcReaderLoop]);

	let nfcWriteSession: CloseableHCESession | undefined;
	const [nfcWriterLoop, updateWrite] = useState(false); // used to refresh NFC data
	const reWriteNfc = () => {
		updateWrite(!nfcWriterLoop);
	};
	// NFC write
	useOnDepUpdate(() => {
		console.log('nfc write');
		new HandledPromise<TransmissionData>(resolve => {
			// validation
			if (!uuid.current) throw new Error('Torch not yet ready');
			if (!location.current) throw new Error('Position not accurate enough');
			resolve({
				uuid: uuid.current,
				location: location.current,
			});
		})
			.then(tmd => nfcStartWrite(tmd, nfcWriteSession))
			.then(x => (nfcWriteSession = x))
			.finally(() => setTimeout(reWriteNfc, 1000));

		return () => {
			nfcWriteSession?.close();
		};
	}, [nfcWriterLoop]);

	let uuid = useRef<string | undefined>(undefined);
	let firestate = useRef(false);
	// kinda constructor
	useOnInit(() => {
		getUserData().then(r => {
			uuid.current = r.uuid; // uuid would not trigger a rerender here
			firestate.current = r.fireStatus;
			console.log(`fetched user ${uuid.current} with fire ${r.fireStatus}`);
			if (r.fireStatus === false) {
				console.log('start READING');
				reReadNfc();
			} else {
				console.log('start WRITING');
				reWriteNfc();
			}
		});
	});

	// collects updates on location data
	let location = useRef<GeoLocation | undefined>(undefined);
	// Effect to update location data
	let geoLocationSub: GeoServiceSubscription;
	useOnInit(() =>
		getPermission(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
			.then(() => {
				geoLocationSub?.unsubscribe();
				geoLocationSub = subscribePosition(async (pos: GeoLocation) => {
					location.current = pos;
				});
			})
			.catch(e => {
				/*console.warn('Error');
				console.warn(e);*/
			})
	);

	/**
	 * USED FOR DEV PURPOSES ONLY: reloades the userdata
	 * subsequently forcing a re-render through setState()
	 */
	const reloadData = () => {
		getUserData().then(ud => {
			uuid.current = ud.uuid;
			firestate.current = ud.fireStatus;
		});
	};

	const [connectStatus, setConnectStatus] = useState<boolean | null>(); 
	checkConnected().then(res =>{
		setConnectStatus(res);
	   });
	if (connectStatus == false) {
		// start WebErrorView
		const errorMessage = ErrorHandler.errorList.find(
			x => x.icon == 'internetWarning'
		);
		if (typeof errorMessage === 'undefined') {
			var message = 'Please close the app and check your network connection';
		} else {
			var message = errorMessage.message;
		}
		return (
			<View style={styles.containerMap}>
				<WebErrorView msg={message} />
			</View>
		);
	} else {
		// start fireview
		return (
			<LinearGradient
			colors={
				firestate.current ? ['#ffffff', '#FF3A3A'] : ['#ffffff', '#6F3FAF']
			}
			style={styles.container}>
			<DebugBar reload={reloadData} />
			<FireView fire={firestate.current} />
			<ErrorBar
				bigSize={bigSize}
				switchBigSize={switchBigSize}
				remMsg={remError}
			/>
		</LinearGradient>
	);
}

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
	containerMap: {
		width: '100%',
		height: '100%',
	},
});
