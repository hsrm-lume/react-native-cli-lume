import React, {useState} from 'react';
import {StyleSheet, Text, TouchableHighlight} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import DebugBar from '../components/debugBar';
import FireView from '../components/fire';
import {userData} from '../types/userData';
import storageService from '../services/storageService';
import nfcService from '../services/nfcService';
import {transmissionData} from '../types/tranmissionData';
import {apiData} from '../types/apiData';
import restClient from '../services/RestClient';
import {environment} from '../env/environment';

export default function FireScreen() {
	var [fireState, setFire] = useState(false);
	var [uid, setUid] = useState('');
	const sService = new storageService();
	const nService = new nfcService();

	const initUser = async () => {
		await sService.initRealm().then(async function () {
			await sService.getUserData().then(async function (res) {
				if (res.uid === undefined && res.fireStatus === undefined)
					await sService.initializeUserData().then(function (r) {
						assignData(r as userData);
					});
				else assignData(res);
			});
		});
	};

	const assignData = (data: userData) => {
		setUid(data.uid);
		setFire(data.fireStatus);
	};

	const startHCE = () => {
		console.log('HCE');
		nService.startHCE(uid);
	};

	const startNFCRead = async () => {
		try {
			console.log('Reading');
			await nService.readNfcTag().then(async function (r) {
				if (r === undefined || r === null) return;
				let jTag = nService.processNfcTag(r);
				if (!testJSON(jTag)) return;
				let tagInfo = JSON.parse(jTag) as transmissionData;

				let apiD: apiData = {
					uuidChild: uid,
					uuidParent: tagInfo.uid,
					position: tagInfo.location,
				};
				if (
					(await restClient.postContact(
						environment.API_BASE_DOMAIN + 'new',
						apiD
					)) < 300
				) {
					setFire(true);
					sService.writeUserData({fireStatus: true, uid: uid});
				}
			});
		} catch (e) {
			console.warn(e);
		}
	};

	//ugly JSON Test
	const testJSON = (test: string) => {
		try {
			return JSON.parse(test) && !!test;
		} catch (e) {
			return false;
		}
	};

	const adminHandler = () => {
		console.log('making Admin');
		fireState = !fireState;

		let data: userData = {
			fireStatus: fireState,
			uid: '00000000-0000-4000-A000-000000000000',
		};
		let l = sService.createAdmin(data);
		setFire(l!.fireStatus);
		setUid(l!.uid);
		console.log(l);
	};

	initUser();
	return (
		<LinearGradient
			colors={fireState ? ['#ffffff', '#FF3A3A'] : ['#ffffff', '#6F3FAF']}
			style={styles.container}>
			<DebugBar adminHandler={adminHandler} />
			<FireView fire={fireState} />
			<TouchableHighlight
				style={styles.button}
				underlayColor="#dddddd"
				onPress={() => (fireState ? startHCE() : startNFCRead())}>
				<Text style={styles.text1}>
					{fireState ? 'Feuer teilen' : 'Feuer empfangen'}
				</Text>
			</TouchableHighlight>
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
