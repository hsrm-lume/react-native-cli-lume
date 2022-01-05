import React, {useState} from 'react';
import {StyleSheet, ScrollView} from 'react-native';
import {getDismissableErrors, MessageKey, remError} from '../../services';
import {ErrorIcon} from './errorIcon';
import {ErrorWindow} from './errorWindow';

/**
 * @returns a jsx component that displays a scrollable list of error items.
 * The List can be clicked to open an ErrorWindow
 */
const ErrorBar = () => {
	var [bigSize, setBigSize] = useState(false);
	const switchBigSize = () => setBigSize(!bigSize);

	const [r, setRepaint] = useState(false);
	// removeMessage callback gets called as wrapper
	// to trigger a repaint after a message got removed
	const removeMessage = (errType: MessageKey) => {
		remError(errType);
		// close ErrorWindow if no errors are left
		if (getDismissableErrors().length == 0) setBigSize(false);
		setRepaint(!r);
	};

	return bigSize ? (
		<ErrorWindow close={switchBigSize} removeMsg={removeMessage} />
	) : (
		<ScrollView horizontal style={styles.errorBar}>
			{getDismissableErrors().map((item, i) => (
				<ErrorIcon errType={item} action={switchBigSize} key={i} />
			))}
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	errorBar: {
		backgroundColor: '#ffffff',
		borderRadius: 25,
		position: 'absolute',
		bottom: 10,
		right: 10,
		marginLeft: 10,
		paddingLeft: 0,
		paddingRight: 0,
	},
});
export default ErrorBar;