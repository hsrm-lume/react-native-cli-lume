import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import CustomWebView from '../components/webView';
import {environment} from '../env/environment';
import {getUserData} from '../services';

export default function WebScreen() {
	var [uid, setUid] = useState('');

	getUserData().then(ud => setUid(ud.uuid));

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
