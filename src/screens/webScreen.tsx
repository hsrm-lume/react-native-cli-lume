import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {StorageService} from '../services';
import CustomWebView from '../components/webView';
import {environment} from '../env/environment';

export default function WebScreen({}) {
	var [uid, setUid] = useState('');
	const sService = new StorageService();

	const initUid = async () => {
		await sService.openRealm().then(async () => {
			setUid((await sService.getUserData()).uuid);
		});
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
