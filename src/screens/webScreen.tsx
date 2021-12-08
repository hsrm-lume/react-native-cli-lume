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

	const offline = ErrorHandler.errorList.some(x => x.icon == 'internetWarning');

	if (offline) {
		// start WebErrorView
		const errorMessage = ErrorHandler.errorList.find(x => x.icon == 'internetWarning');
		if (typeof errorMessage === 'undefined') {
			var message = 'Keine Internetverbindung';
		} else {
			var message = errorMessage.message;
		}
		return (
			<View style={styles.containerMap}>
				<WebErrorView msg={message} />
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
