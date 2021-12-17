import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ErrorMessage} from '../../services';
import {Icon} from './icon';
import CloseIcon from '../../assets/thinCross.svg';
import {ErrorIcon} from './errorIcon';
/**
 * @param item the ErrorMessage to display
 * @param removeMsg a callback to remove the message
 * @returns a jsx component that displays the error message with icon and dismiss button
 */
export const ErrorItem = (props: {
	item: ErrorMessage;
	removeMsg: (m: ErrorMessage) => void;
}) => (
	<View style={styles.message}>
		<ErrorIcon msg={props.item} />
		<View style={styles.textBox}>
			<Text style={styles.text}>{props.item.message}</Text>
		</View>
		{
			/* only add remove callback if message is dismissable */
			props.item.dissmisable ? (
				<Icon
					icon={CloseIcon}
					style={styles.closeIcon}
					action={() => props.removeMsg(props.item)}
				/>
			) : null
		}
	</View>
);

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
		fontSize: 20,
		color: '#000000',
	},
});
