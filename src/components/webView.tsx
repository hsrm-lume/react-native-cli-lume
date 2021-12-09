import React from 'react';
import {StyleSheet} from 'react-native';
import {WebView} from 'react-native-webview';
import WebErrorView from './webErrorView';
const CustomWebView = (props: {url: string}) => {
	return (
		<WebView
			source={{uri: props.url}}
			style={styles.WebView}
			renderLoading={() =>
				WebErrorView({
					title: 'Loading...',
					msg: 'Please wait...',
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
