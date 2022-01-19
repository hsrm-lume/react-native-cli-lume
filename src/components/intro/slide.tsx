import React from 'react';
import {StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import {SvgProps} from 'react-native-svg';
import {Icon} from '../error/icon';
const SlideView = (props: {
	advance: () => void;
	retreat: () => void;
	data: {
		title: string;
		image: React.FC<SvgProps>;
		explanation: string;
		noPrev?: boolean;
	};
}) => {
	return (
		<View style={styles.container}>
			<View style={styles.headlineBox}>
				<Text style={styles.headlineText}>{props.data.title}</Text>
			</View>
			<View style={styles.imageContainer}>
				<Icon icon={props.data.image} style={styles.imageStyles}></Icon>
			</View>
			<View style={styles.descriptionContainer}>
				<Text style={styles.description && styles.text}>
					{props.data.explanation}
				</Text>
			</View>
			<View style={styles.advanceContainer}>
				{props.data.noPrev == undefined ? (
					<TouchableHighlight
						style={styles.pageButtonsButton}
						underlayColor="#FFFFFF"
						onPress={props.retreat}>
						<Text style={styles.text}>Previous</Text>
					</TouchableHighlight>
				) : (
					<></>
				)}
				<TouchableHighlight
					style={styles.pageButtonsButton}
					underlayColor="#FFFFFF"
					onPress={props.advance}>
					<Text style={styles.text}>Next</Text>
				</TouchableHighlight>
			</View>
		</View>
	);
};
const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'space-between',
		margin: '15%',
		marginBottom: '30%',
	},
	headlineBox: {
		marginBottom: '15%',
	},
	headlineText: {
		fontFamily: 'Domus-Tilting',
		fontSize: 40,
		textAlign: 'center',
		color: '#000000',
	},
	advanceContainer: {
		marginTop: '10%',
		alignSelf: 'center',
		justifyContent: 'space-evenly',
		flexDirection: 'row',
		width: 200,
		bottom: 30,
	},
	pageButtonsButton: {
		alignItems: 'center',
		justifyContent: 'center',
		height: 40,
		width: 80,
		borderRadius: 30,
		backgroundColor: '#FFFFFF',
	},
	imageContainer: {
		height: '45%',
		marginBottom: '15%',
	},
	imageStyles: {
		width: '100%',
		height: '100%',
	},
	descriptionContainer: {
		marginBottom: '15%',
		alignSelf: 'center',
	},
	description: {
		fontSize: 15,
		fontFamily: 'Nexusa-Next',
	},
	text: {
		color: '#000000',
		fontFamily: 'Nexusa-Next',
	},
});
export default SlideView;
