import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Errors, MessageKey} from '../../services';
import {Icon} from './icon';
import CloseIcon from '../../assets/thinCross.svg';
import {ErrorIcon} from './errorIcon';

/**
 * @param item the ErrorMessage to display
 * @param removeMsg a callback to remove the message
 * @returns a jsx component that displays the error message with icon and dismiss button
 */
export const ErrorItem = (props: {
	item: MessageKey;
	removeMsg: (errType: MessageKey) => void;
}) => {
	// get the message details for the passed key
	const m = Errors.getMessage(props.item);

	return (
		<View style={styles.message}>
			<ErrorIcon errType={props.item} />
			<View style={styles.textBox}>
				<Text style={styles.header}>{m.msg}</Text>
				{m.desc ? <Text style={styles.text}>{m.desc}</Text> : null}
			</View>
			<Icon
				icon={CloseIcon}
				style={styles.closeIcon}
				action={() => props.removeMsg(props.item)}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	message: {
		flexDirection: 'row',
	},
	closeIcon: {
		width: 20,
		justifyContent: 'center',
	},
	textBox: {
		justifyContent: 'center',
		paddingLeft: '2%',
		paddingRight: '2%',
		width: '75%',
	},
	text: {
		fontFamily: 'Nexusa-Next',
		fontSize: 20,
		color: '#000000',
	},
	header: {
		fontFamily: 'Nexusa-Next-Bold',
		fontSize: 20,
		color: '#000000',
	},
});
