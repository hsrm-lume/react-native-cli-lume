import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import {WebView} from 'react-native-webview';
import FullErrorView from '../error/fullErrorView';
const CustomWebView = (props: {url: string}) => {
	const [repaint, setRepaint] = useState(true);
	const repaintComponent = () => {
		console.log('repainting');
		setRepaint(!repaint);
	};
	return (
		<WebView
			source={{uri: props.url}}
			style={styles.WebView}
			renderLoading={() =>
				/* TODO: Loading view */
				FullErrorView({
					item: 'loading',
					action: null,
				})
			}
			renderError={(_domain, _code, desc) =>
				FullErrorView({
					item: 'internet.map',
					action: {
						desc: 'retry',
						action: repaintComponent,
					},
					details: desc,
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
