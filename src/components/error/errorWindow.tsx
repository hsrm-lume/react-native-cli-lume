import React from 'react';
import {
	GestureResponderEvent,
	ScrollView,
	StyleSheet,
	View,
} from 'react-native';
import {ErrorHandler, MessageKey} from '../../services';
import ArrowDown from '../../assets/arrowSmallDown.svg';
import {ErrorItem} from './errorItem';
import {Icon} from './icon';

/**
 * @param close a callback that closes the ErrorWindow
 * @param removeMsg a callback that removes a given ErrorMessage
 * @returns a jsx component that shows ErrorMessages in a Window
 */
export const ErrorWindow = (props: {
	close: (event: GestureResponderEvent) => void;
	removeMsg: (errType: MessageKey) => void;
}) => (
	<View style={styles.errorWindow}>
		<Icon icon={ArrowDown} action={props.close} style={styles.closeWindow} />
		<ScrollView style={styles.scrollView}>
			{ErrorHandler.errorList.map((item, i) => (
				<ErrorItem item={item} removeMsg={props.removeMsg} key={i} />
			))}
		</ScrollView>
	</View>
);

const styles = StyleSheet.create({
	errorWindow: {
		bottom: 10,
		left: '4%',
		right: '4%',
		backgroundColor: '#ffffff',
		borderRadius: 30,
		position: 'absolute',
		paddingBottom: 10,
	},
	scrollView: {
		marginTop: 30,
	},
	closeWindow: {
		alignSelf: 'flex-end',
		height: 25,
		width: 25,
		top: 20,
		right: 20,
	},
});
