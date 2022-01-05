import React from 'react';
import {StyleSheet, View, Text, TouchableHighlight} from 'react-native';
import {remError} from '../../services';
import {Errors, MessageKey} from '../../services/Errors';
import {ErrorIcon} from './errorIcon';

interface ErrorAction {
	desc: string;
	action: () => void;
}

/**
 * @param item the ErrorMessage to display
 * @param action Button to fix or retry
 * @returns a jsx component that displays an error in full-screen
 */
const FullErrorView = (props: {item: MessageKey; action?: ErrorAction}) => {
	const m = Errors.getMessage(props.item);
	const a = props.action || {desc: 'retry', action: () => remError(props.item)};
	return (
		<View style={styles.ErrorView}>
			<View style={styles.Image}>
				<ErrorIcon errType={props.item} style={styles.Svg} />
			</View>
			<View>
				<Text style={styles.Title}>{m.msg}</Text>
			</View>
			{m.desc ? (
				<View>
					<Text style={styles.Message}>{m.desc}</Text>
				</View>
			) : null}
			<View>
				<TouchableHighlight
					style={[styles.FixButton]}
					underlayColor="#ffffff"
					onPress={a.action}>
					<Text style={styles.btnText}>{a.desc}</Text>
				</TouchableHighlight>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	FixButton: {
		marginTop: '10%',
		backgroundColor: '#FFFFFF',
		borderRadius: 25,
	},
	btnText: {
		color: '#000000',
		fontSize: 18,
		paddingRight: '10%',
		paddingLeft: '10%',
		paddingTop: '10%',
		paddingBottom: '10%',
	},
	ErrorView: {
		height: '100%',
		width: '100%',
		backgroundColor: '#EEEEEE',
		alignItems: 'center',
	},
	Image: {
		height: 350,
		width: 350,
		marginTop: 40,
	},
	Svg: {
		width: '100%',
		height: '100%',
	},
	Title: {
		color: '#000000',
		fontSize: 30,
		marginTop: -20,
	},
	Message: {
		color: '#000000',
		fontSize: 18,
		marginTop: 60,
		paddingRight: '10%',
		paddingLeft: '10%',
	},
});

export default FullErrorView;
