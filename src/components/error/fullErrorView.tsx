import React from 'react';
import {StyleSheet, View, Text, TouchableHighlight} from 'react-native';
import {ErrorMessage, Errors} from '../../services/Errors';
import {ErrorIcon} from './errorIcon';

/**
 * @param item the ErrorMessage to display
 * @returns a jsx component that displays an error in full-screen
 */
const FullErrorView = (props: {
	item: ErrorMessage;
	action?: () => void;
	fixBtnText: string;
}) => {
	const m = Errors.getMessage(props.item.errorType);
	const action = props.action || undefined; // TODO register a button action that works as "fix the error" action
	return (
		<View style={styles.ErrorView}>
			<View style={styles.Image}>
				<ErrorIcon errType={props.item.errorType} style={styles.Svg} />
			</View>
			<View>
				<Text style={styles.Title}>{m.msg}</Text>
			</View>
			{m.desc ? (
				<View>
					<Text style={styles.Message}>{m.desc}</Text>
				</View>
			) : null}
			{action ? (
				/* TODO: Add button with callback */ <View>
					<TouchableHighlight
						style={[styles.FixButton]}
						underlayColor="#ffffff"
						onPress={props.action}>
						<Text style={styles.btnText}>{props.fixBtnText}</Text>
					</TouchableHighlight>
				</View>
			) : null}
		</View>
	);
};

const styles = StyleSheet.create({
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
});

export default FullErrorView;
