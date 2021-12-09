import React from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import {getUserData, writeUserData} from '../services';
const DebugBar = (props: {reload: Function}) => {
	/**
	 *  creates an new user with a set admin userdata and toggles the fireState
	 */
	const adminHandler = async () => {
		console.log('Toggling Fire');
		getUserData().then(async ud => {
			await writeUserData({fireStatus: !ud.fireStatus});
			props.reload();
		});
	};

	return (
		<View>
			<Pressable
				style={styles.pressable}
				onPress={() => {
					adminHandler();
				}}>
				<Text>Toggle Fire</Text>
			</Pressable>
		</View>
	);
};

const styles = StyleSheet.create({
	pressable: {
		position: 'absolute',
		width: 50,
		height: 50,
		right: '10%',
		backgroundColor: '#000000',
		zIndex: 1,
	},
	black: {
		color: '#000000',
	},
});
export default DebugBar;
