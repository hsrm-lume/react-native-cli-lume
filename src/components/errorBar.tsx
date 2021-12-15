import React, {useState} from 'react';
import {
	View,
	Text,
	StyleSheet,
	TouchableHighlight,
	ScrollView,
} from 'react-native';
import ErrorHandler from '../services/ErrorHandler';
import Warning from '../assets/warning.svg';
import LocationWarning from '../assets/locationWarning.svg';
import LocationError from '../assets/locationError.svg';
import InternetWarning from '../assets/internetWarning.svg';
import Close from '../assets/close.svg';
import CloseMsg from '../assets/smallClose.svg';

const ErrorBar = () => {
	var [bigSize, setBigSize] = useState(false);
	const switchBigSize = () => {
		setBigSize(!bigSize);
	};

	if (bigSize) {
		return (
			<View style={styles.barBig}>
				<TouchableHighlight
					style={styles.closeWindow}
					underlayColor="#ffffff"
					onPress={() => {
						switchBigSize();
					}}>
					<Close width={50} height={50} />
				</TouchableHighlight>
				<ScrollView>
					{ErrorHandler.errorList.map(function (item, i) {
						switch (item.icon) {
							case 'apiConnection':
							case 'internetWarning':
								return (
									<View style={styles.message} key={i}>
										<View style={styles.icon}>
											<InternetWarning width={'100%'} height={'100%'} />
										</View>
										<View style={styles.textBox}>
											<Text style={styles.text}>{item.message}</Text>
										</View>
										<TouchableHighlight
											style={styles.closeMsg}
											underlayColor="#ffffff"
											onPress={() => {
												ErrorHandler.remError(i);
											}}>
											<CloseMsg width={15} height={15} />
										</TouchableHighlight>
									</View>
								);
							case 'locationError':
								return (
									<View style={styles.message} key={i}>
										<View style={styles.icon}>
											<LocationError width={'100%'} height={'100%'} />
										</View>
										<View style={styles.textBox}>
											<Text style={styles.text}>{item.message}</Text>
										</View>
										<TouchableHighlight
											style={styles.closeMsg}
											underlayColor="#ffffff"
											onPress={() => {
												ErrorHandler.remError(i);
											}}>
											<CloseMsg width={15} height={15} />
										</TouchableHighlight>
									</View>
								);
							case 'locationWarning':
								return (
									<View style={styles.message} key={i}>
										<View style={styles.icon}>
											<LocationWarning width={'100%'} height={'100%'} />
										</View>
										<View style={styles.textBox}>
											<Text style={styles.text}>{item.message}</Text>
										</View>
										<TouchableHighlight
											style={styles.closeMsg}
											underlayColor="#ffffff"
											onPress={() => {
												ErrorHandler.remError(i);
											}}>
											<CloseMsg width={15} height={15} />
										</TouchableHighlight>
									</View>
								);
							default:
								return (
									<View style={styles.message} key={i}>
										<View style={styles.icon}>
											<Warning width={'100%'} height={'100%'} />
										</View>
										<View style={styles.textBox}>
											<Text style={styles.text}>{item.message}</Text>
										</View>
										<TouchableHighlight
											style={styles.closeMsg}
											underlayColor="#ffffff"
											onPress={() => {
												ErrorHandler.remError(i);
											}}>
											<CloseMsg width={15} height={15} />
										</TouchableHighlight>
									</View>
								);
						}
					})}
				</ScrollView>
			</View>
		);
	} else {
		return (
			<View style={styles.barSmall}>
				<ScrollView horizontal>
					{ErrorHandler.errorList.map(function (item, i) {
						switch (item.icon) {
							case 'apiConnection':
							case 'internetWarning':
								return (
									<TouchableHighlight
										style={styles.icon}
										underlayColor="#ffffff"
										onPress={() => {
											switchBigSize();
										}}
										key={i}>
										<InternetWarning width={'100%'} height={'100%'} />
									</TouchableHighlight>
								);
							case 'locationError':
								return (
									<TouchableHighlight
										style={styles.icon}
										underlayColor="#ffffff"
										onPress={() => {
											switchBigSize();
										}}
										key={i}>
										<LocationError width={'100%'} height={'100%'} />
									</TouchableHighlight>
								);
							case 'locationWarning':
								return (
									<TouchableHighlight
										style={styles.icon}
										underlayColor="#ffffff"
										onPress={() => {
											switchBigSize();
										}}
										key={i}>
										<LocationWarning width={'100%'} height={'100%'} />
									</TouchableHighlight>
								);
							default:
								return (
									<TouchableHighlight
										style={styles.icon}
										underlayColor="#ffffff"
										onPress={() => {
											switchBigSize();
										}}
										key={i}>
										<Warning width={'100%'} height={'100%'} />
									</TouchableHighlight>
								);
						}
					})}
				</ScrollView>
			</View>
		);
	}
};

const styles = StyleSheet.create({
	barSmall: {
		backgroundColor: '#ffffff',
		borderRadius: 25,
		alignItems: 'center',
		justifyContent: 'center',
		position: 'absolute',
		bottom: 10,
		right: 10,
		marginLeft: 20,
		paddingLeft: 0,
		paddingRight: 0,
	},

	barBig: {
		bottom: 10,
		top: '2%',
		left: '4%',
		right: '4%',
		backgroundColor: '#ffffff',
		borderRadius: 30,
		position: 'absolute',
		opacity: 1,
		paddingBottom: 25,
	},

	closeWindow: {
		alignItems: 'flex-end',
	},

	closeMsg: {
		height: 50,
		justifyContent: 'center',
	},

	message: {
		flexDirection: 'row',
	},

	icon: {
		height: 50,
		width: 50,
		borderRadius: 25,
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
export default ErrorBar;