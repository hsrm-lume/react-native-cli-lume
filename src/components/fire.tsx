import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Torch from '../assets/torch.svg';
import TorchOff from '../assets/torchOff.svg';

const FireView = (props: {fire: boolean}) => (
	<View style={styles.container}>
		<View style={styles.headlineBox}>
			<Text style={styles.headlineText}>
				{props.fire ? 'SHARE YOUR FIRE!' : 'ILLUMINATE YOUR FIRE!'}
			</Text>
		</View>
		<View style={styles.fire}>
			{props.fire ? (
				<Torch width={'100%'} height={'100%'} />
			) : (
				<TorchOff width={'100%'} height={'100%'} />
			)}
		</View>
	</View>
);

const styles = StyleSheet.create({
	container: {
		height: '80%',
		width: '100%',
	},

	headlineBox: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'flex-end',
	},

	headlineText: {
		fontSize: 30,
		color: '#000000',
	},

	fire: {
		flex: 4,
	},
});

export default FireView;
