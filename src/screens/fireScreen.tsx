import React, {useEffect, useState} from 'react';
import {PermissionsAndroid, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import DebugBar from '../components/debugBar';
import FireView from '../components/fire';
import {
	CloseableHCESession,
	GeoServiceSubscription,
	getPermission,
	nfcReadNext,
	nfcStartWrite,
	StorageService,
	subscribePosition,
} from '../services';
import {GeoLocation} from '../types/GeoLocation';

/**
 * @param test JSON formatted String, to be tested
 * @returns boolean if the JSON formatted String is correctly formatted as a JSON Object
 */
const testJSON = (test: string): boolean => {
	try {
		return JSON.parse(test) && !!test;
	} catch (e) {
		return false;
	}
};

export default function FireScreen() {
	let [uuid, setUuid] = useState('');
	let [firestate, setFirestate] = useState(false);
	const sService = new StorageService();
	let geoLocationSub: GeoServiceSubscription;
	let nfcWriteSession: CloseableHCESession;

	/**
	 *  initializes the userdata with the Data from the storage Service
	 */
	useEffect(() => {
		async function initializeUser() {
			await sService.openRealm().then(() => {
				sService.getUserData().then(r => {
					setUuid(r.uuid);
					setFirestate(r.fireStatus);
					firestate ? startWritingNFCData() : startNFCRead();
				});
			});
		}
		initializeUser();
		return function cleanup() {
			if (firestate && geoLocationSub !== undefined)
				geoLocationSub.unsubscribe();
			console.log(geoLocationSub);
		};
	});

	/**
	 * @param tmd TransmissionData to be written to NFC tag
	 * @returns Promise of Session, which has to be closed afterwards
	 */
	const startWritingNFCData = () =>
		getPermission(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
			.then(() => {
				geoLocationSub = subscribePosition((position: GeoLocation) => {
					console.log(position);
					if (nfcWriteSession !== undefined) nfcWriteSession.close();
					nfcStartWrite({uid: uuid, location: position});
				});
			})
			.catch(e => {
				console.warn('Error');
				console.warn(e);
			});

	const startNFCRead = async () => {
		//try to incorporate this: https://github.com/revtel/react-native-nfc-manager/issues/153#issuecomment-943704701
		try {
			const tagData = await nfcReadNext();
			console.log(tagData);
		} catch (e) {
			console.warn(e);
			console.log('retrying NFC');
			startNFCRead();
			return;
		}
	};

	console.log('Render');

	/**
	 * USED FOR DDEV PURPOSES ONLY: Assusmes, that the realm is open! and reloades the userdata
	 * subsequently forcing a re-render through setState()
	 */
	const reloadData = () =>
		sService.getUserData().then(r => {
			setUuid(r.uuid);
			setFirestate(r.fireStatus);
		});

	return (
		<LinearGradient
			colors={firestate ? ['#ffffff', '#FF3A3A'] : ['#ffffff', '#6F3FAF']}
			style={styles.container}>
			<DebugBar reload={reloadData} />
			<FireView fire={firestate} />
			{/*<TouchableHighlight
				style={styles.button}
				underlayColor="#dddddd"
				onPress={() => {
					console.group('press');
					firestate ? startWritingNFCData() : startNFCRead();
				}}>
				<Text style={styles.text1}>
					{firestate ? 'Feuer teilen' : 'Feuer empfangen'}
				</Text>
			</TouchableHighlight>*/}
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
