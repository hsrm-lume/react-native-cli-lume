import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import CustomWebView from '../components/web/webView';
import {environment} from '../env/environment';

import {getUserData} from '../services';

import WebErrorView from '../components/web/webErrorView';
import {ErrorHandler} from '../services/ErrorHandler';

export default function WebScreen() {
	var [uid, setUid] = useState('');

	getUserData().then(ud => setUid(ud.uuid));

	const offline = ErrorHandler.errorList.find(
		x => x.errorType == 'error.internet'
	);

	return (
		<View style={styles.containerMap}>
			{offline ? (
				<WebErrorView msg={offline.message} />
			) : (
				<CustomWebView url={environment.WEBVIEW_BASE_DOMAIN + uid} />
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	containerMap: {
		width: '100%',
		height: '100%',
	},
});
