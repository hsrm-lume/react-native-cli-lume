import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import InternetWarning from '../assets/internetWarning.svg';

const WebErrorView = (props: {msg?: string; title?: string}) => {
	const message = props.msg || '';
	const title = props.title || 'KEINE VERBINDUNG!';

	return (
		<View style={styles.ErrorView}>
			<View style={styles.Image}>
				<InternetWarning width={'100%'} height={'100%'} />
			</View>
			<View>
				<Text style={styles.Title}>{title}</Text>
			</View>
			<View>
				<Text style={styles.Message}>{message}</Text>
			</View>
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
	Title: {
		color: '#000000',
		fontSize: 30,
		marginTop: -20,
	},
	Message: {
		color: '#000000',
		fontSize: 18,
		marginTop: 60,
		paddingLeft: '10%',
		paddingRight: '10%',
	},
});

export default WebErrorView;
