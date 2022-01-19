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
		<>
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
		</>
	);
};

const styles = StyleSheet.create({
	headlineBox: {
		marginTop: '20%',
		alignItems: 'center',
		justifyContent: 'flex-end',
		alignSelf: 'center',
		width: '80%',
	},
	headlineText: {
		fontFamily: 'Domus-Tilting',
		fontSize: 40,
		color: '#000000',
		textAlign: 'center',
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
		marginTop: '10%',
		height: '35%',
		alignSelf: 'center',
		alignItems: 'center',
		justifyContent: 'center',
	},
	imageStyles: {
		height: '100%',
		width: 500,
	},
	descriptionContainer: {marginTop: '10%', width: '80%', alignSelf: 'center'},
	description: {fontSize: 15, fontFamily: 'Nexusa-Next'},
	text: {
		color: '#000000',
		fontFamily: 'Nexusa-Next',
	},
});
export default SlideView;
