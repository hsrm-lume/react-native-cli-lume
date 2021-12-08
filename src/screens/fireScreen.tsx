import React, {useEffect, useState} from 'react';
import {PermissionsAndroid, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import DebugBar from '../components/debugBar';
import FireView from '../components/fire';
import {
	CloseableHCESession,
	nfcCleanupRead,
	nfcReadNext,
	nfcStartWrite,
} from '../services/NfcUtil';
import subscribePosition, {
	GeoServiceSubscription,
} from '../services/GeoService';
import StorageService from '../services/StorageService';
import getPermission from '../services/PermissionsUtil';
import {GeoLocation} from '../types/GeoLocation';
import RestClient from '../services/RestClient';
import {environment} from '../env/environment';
import {TransmissionData} from '../types/TranmissionData';

export default function FireScreen() {
	var [uuid, setUuid] = useState('');
	var [firestate, setFirestate] = useState(false);
	const [nfcReader, updateNfc] = useState(false);
	var position: GeoLocation;
	const sService = new StorageService();
	var geoLocationSub: GeoServiceSubscription;
	var nfcWriteSession: CloseableHCESession;

	/**
	 *  initializes the userdata with the Data from the storage Service
	 */

	useEffect(() => {
		async function initializeUser() {
			await sService.openRealm().then(() => {
				sService.getUserData().then(r => {
					uuid = r.uuid; // uuid would not trigger a rerender here
					setFirestate(r.fireStatus);
					console.log(uuid);
					if (r.fireStatus === false) startNFCRead();
				});
			});
			await getPermission(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
				.then(() => {
					geoLocationSub = subscribePosition((pos: GeoLocation) => {
						position = pos;
						if (firestate === true)
							updateNfcData({uid: uuid, location: position});
					});
				})
				.catch(e => {
					console.warn('Error');
					console.warn(e);
				});
		}
		initializeUser();
		return function cleanup() {
			console.log('cleanup');
			if (firestate && geoLocationSub !== undefined)
				geoLocationSub.unsubscribe();
			else nfcCleanupRead();
		};
	}, [nfcReader]);

	/**
	 * @param tmd TransmissionData to be written to NFC tag
	 * @returns Promise of Session, which has to be closed afterwards
	 */
	const updateNfcData = async (tmd: TransmissionData) => {
		if (nfcWriteSession !== undefined) nfcWriteSession.close();
		nfcWriteSession = await nfcStartWrite(tmd);
	};

	const startNFCRead = async () => {
		console.log('read mode');
		//try to incorporate this: https://github.com/revtel/react-native-nfc-manager/issues/153#issuecomment-943704701
		try {
			var tagData = await nfcReadNext();
			if (tagData.uid === undefined || tagData.location === undefined)
				throw new Error('TagData incomplete');

			RestClient.postContact(
				environment.API_BASE_DOMAIN + environment.API_CONTACT_PATH,
				{
					uuidChild: uuid,
					uuidParent: tagData.uid,
					position:
						position.accuracy < tagData.location.accuracy
							? position
							: tagData.location,
				}
			)
				.then(r => {
					if (r > 300) setFirestate(true);
				})
				.catch(e => {
					console.warn(e);
				});
			updateNfc(!nfcReader);
		} catch (e) {
			console.warn(e);
			updateNfc(!nfcReader);
			return;
		}
	};

	/**
	 * USED FOR DDEV PURPOSES ONLY: Assusmes, that the realm is open! and reloades the userdata
	 * subsequently forcing a re-render through setState()
	 */
	const reloadData = async () => {
		sService.getUserData().then(r => {
			setUuid(r.uuid);
			setFirestate(r.fireStatus);
		});
	};

	return (
		<LinearGradient
			colors={firestate ? ['#ffffff', '#FF3A3A'] : ['#ffffff', '#6F3FAF']}
			style={styles.container}>
			<DebugBar reload={reloadData} />
			<FireView fire={firestate} />
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
