import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {StorageService} from '../services';
import CustomWebView from '../components/webView';
import {environment} from '../env/environment';
import WebErrorView from '../components/webErrorView';
import ErrorHandler from '../services/ErrorHandler';

export default function WebScreen({}) {
	var [uid, setUid] = useState('');
	const sService = new StorageService();

	const initUid = async () => {
		await sService.openRealm().then(async () => {
			setUid((await sService.getUserData()).uuid);
		});
	};

	initUid();

	const userOffline = ErrorHandler.errorList.some(
		x => x.icon == "internetWarning" && x.message == "Du bist offline"
	);

	const lumeOffline = ErrorHandler.errorList.some(
		x => x.icon == "internetWarning" 
		&& x.message == "Die Kartenansicht ist momentan nicht zu erreichen"
	);

	if (userOffline || lumeOffline) { 
		// start WebErrorView
		return (
			<View style={styles.containerMap}>
				<WebErrorView userOffline={userOffline} />
			</View>
		);
	} else {
		// start Webview
		return (
			<View style={styles.containerMap}>
				<CustomWebView url={environment.WEBVIEW_BASE_DOMAIN + uid} />
			</View>
		);
	}
}

const styles = StyleSheet.create({
	containerMap: {
		width: '100%',
		height: '100%',
	},
});
