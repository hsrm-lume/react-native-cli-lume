import React from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';

const DebugTile = (props: {action?: Function; desc?: string}) => {
	return (
		<Pressable
			style={styles.pressable}
			onPress={() => {
				if (props.action) props.action();
				else console.log('No action');
			}}>
			<Text style={styles.text}>{props.desc || 'undefined'}</Text>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	pressable: {
		width: '100%',
		backgroundColor: '#000000',
		marginBottom: 10,
		padding: 10,
	},
	text: {
		color: '#ffffff',
	},
});
export default DebugTile;
