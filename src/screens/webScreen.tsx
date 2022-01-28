import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import CustomWebView from '../components/web/webView';
import {environment} from '../env/environment';
import {getUserData} from '../services';

/**
 * @returns Fullscreen WebView showing the lume map
 */
export default function WebScreen() {
	// uuid is used to show personal data on the map
	const [uid, setUid] = useState('');
	// uuid gets passed as Query Parameter to the WebView (see src/env/environment.tsx)

	// load the uuid from the user data (Realm)
	getUserData().then(ud => setUid(ud.uuid));

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
