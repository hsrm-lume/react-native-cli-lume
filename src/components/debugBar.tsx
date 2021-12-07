import React from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import StorageService from '../services/StorageService';
const DebugBar = (props: {reload: Function}) => {
	const sService = new StorageService();
	sService.openRealm();
	/**
	 *  creates an new user with a set admin userdata and toggles the fireState
	 */
	const adminHandler = async () => {
		console.log('Toggling Fire');
		await sService.getUserData().then(async r => {
			await sService
				.createAdmin({uuid: r.uuid, fireStatus: !r.fireStatus})
				.then(() => {
					props.reload();
				});
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
