import React, {useEffect, useRef, useState} from 'react';
import {PermissionsAndroid, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import DebugBar from '../components/debugBar';
import FireView from '../components/fire';
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
import {GeoLocation} from '../types/GeoLocation';
import {HandledPromise} from '../types/HandledPromise';
import {TransmissionData} from '../types/TranmissionData';
import {useOnDepUpdate} from '../types/useOnDepUpdate';
import {useOnInit} from '../types/useOnInit';

export default function FireScreen() {
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
				console.log('reread next iter');
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
		new HandledPromise()
			.then(() => {
				// validation
				if (!uuid.current) throw new Error('Torch not yet ready');
				if (!location.current) throw new Error('Position not accurate enough');
				return {
					uuid: uuid.current,
					location: location.current,
				} as TransmissionData;
			})
			.then(tmd => nfcStartWrite(tmd, nfcWriteSession))
			.then(x => (nfcWriteSession = x))
			.catch(e => console.warn('Err writing nfc:', e))
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
				console.warn('Error');
				console.warn(e);
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

	return (
		<LinearGradient
			colors={
				firestate.current ? ['#ffffff', '#FF3A3A'] : ['#ffffff', '#6F3FAF']
			}
			style={styles.container}>
			<DebugBar reload={reloadData} />
			<FireView fire={firestate.current} />
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
