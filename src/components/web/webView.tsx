import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import {WebView} from 'react-native-webview';
import FullErrorView from '../error/fullErrorView';

/**
 * @returns A Fullscreen WebView showing the lume map
 */
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
				FullErrorView({
					item: 'loading',
					action: null,
				})
			}
			// show fullscreen error view if the webview fails to load
			// as action register a repaint of this component
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
