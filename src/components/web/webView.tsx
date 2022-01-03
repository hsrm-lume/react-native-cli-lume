import React from 'react';
import {StyleSheet} from 'react-native';
import {WebView} from 'react-native-webview';
import FullErrorView from '../error/fullErrorView';
const CustomWebView = (props: {url: string}) => {
	return (
		<WebView
			source={{uri: props.url}}
			style={styles.WebView}
			renderLoading={() =>
				/* TODO: Loading view */
				FullErrorView({
					item: {
						dissmisable: false,
						errorType: 'warning.internet.map.loading',
					},
				})
			}
			startInLoadingState={true}
		/>
	);
};

const styles = StyleSheet.create({
	WebView: {
		height: '100%',
		width: '100%',
	},
});

export default CustomWebView;
