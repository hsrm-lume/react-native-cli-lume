import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import CustomWebView from '../components/webView';
import {environment} from '../env/environment';

import {getUserData} from '../services';

import WebErrorView from '../components/webErrorView';
import {ErrorHandler} from '../services/ErrorHandler';

export default function WebScreen() {
	var [uid, setUid] = useState('');

	getUserData().then(ud => setUid(ud.uuid));

	const offline = ErrorHandler.errorList.find(
		x => x.errorType == 'error.internet'
	);

	if (offline) {
		// start WebErrorView
		return (
			<View style={styles.containerMap}>
				<WebErrorView msg={offline.message} />
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
