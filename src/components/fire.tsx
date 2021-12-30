import React from 'react';
import {View, Text, StyleSheet, TouchableHighlight} from 'react-native';
import Torch from '../assets/torch.svg';
import TorchOff from '../assets/torchOff.svg';
import QRCode from '../assets/qrCode.svg';
import Camera from '../assets/camera.svg';

const FireView = (props: {fire: boolean; updateQrStatus: () => void}) => (
	<>
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
		<View style={styles.button}>
			<TouchableHighlight
				style={styles.icon}
				underlayColor="#FFFFFF"
				onPress={props.updateQrStatus}>
				{props.fire ? (
					<QRCode width={'100%'} height={'100%'} />
				) : (
					<Camera width={'100%'} height={'100%'} />
				)}
			</TouchableHighlight>
		</View>
	</>
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

	button: {
		backgroundColor: '#FFFFFF',
		borderRadius: 30,
		alignSelf: 'center',
		alignItems: 'center',
		justifyContent: 'center',
		height: 60,
		width: 60,
		bottom: 30,
	},

	icon: {
		height: 40,
		width: 40,
		borderRadius: 20,
	},
});

export default FireView;
