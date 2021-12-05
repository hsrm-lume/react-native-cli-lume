import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {userData} from '../types/userData';
import storageService from '../services/storageService';
import CustomWebView from '../components/webView';
import {environment} from '../env/environment';

export default function WebScreen({}) {
	var [uid, setUid] = useState('');
	const sService = new storageService();

	const initUid = async () => {
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
	};

	initUid();
	//start Webview
	return (
		<View style={styles.containerMap}>
			<CustomWebView url={environment.WEBVIEW_BASE_DOMAIN + uid} />
		</View>
	);
}

const styles = StyleSheet.create({
	containerMap: {
		width: '100%',
		height: '100%',
	},
});
