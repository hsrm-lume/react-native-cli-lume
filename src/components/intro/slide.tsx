import React from 'react';
import {StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import {SvgProps} from 'react-native-svg';
import {Icon} from '../error/icon';

/**
 * Shows an intro slide with icon, text and buttons to navigate forwards or backwards.
 * @param props data to display and callbacks form navigation
 */
const SlideView = (props: {
	advance: () => void;
	retreat: () => void;
	data: {
		title: string;
		image: React.FC<SvgProps>;
		explanation: string;
		noPrev?: boolean;
	};
}) => (
	<View style={styles.container}>
		<View style={styles.headlineBox}>
			<Text style={styles.headlineText}>{props.data.title}</Text>
		</View>
		<View style={styles.imageContainer}>
			<Icon icon={props.data.image} style={styles.imageStyles} />
		</View>
		<View style={styles.descriptionContainer}>
			<Text style={styles.description}>{props.data.explanation}</Text>
		</View>
		<View style={styles.advanceContainer}>
			{props.data.noPrev === undefined ? (
				<TouchableHighlight
					style={styles.pageButtons}
					underlayColor="#FFFFFF"
					onPress={props.retreat}>
					<Text style={styles.description}>Previous</Text>
				</TouchableHighlight>
			) : null}
			<TouchableHighlight
				style={styles.pageButtons}
				underlayColor="#FFFFFF"
				onPress={props.advance}>
				<Text style={styles.description}>Next</Text>
			</TouchableHighlight>
		</View>
	</View>
);

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'space-between',
		margin: '15%',
		marginBottom: 90,
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
		alignSelf: 'center',
		justifyContent: 'space-evenly',
		flexDirection: 'row',
		width: 200,
	},
	pageButtons: {
		alignItems: 'center',
		justifyContent: 'center',
		height: 40,
		width: 80,
		borderRadius: 30,
		backgroundColor: '#FFFFFF',
	},
	imageContainer: {flex: 1, marginBottom: '7%'},
	imageStyles: {
		width: '100%',
		height: '100%',
	},
	descriptionContainer: {
		marginBottom: '10%',
		alignSelf: 'center',
	},
	description: {
		lineHeight: 30,
		color: '#000000',
		fontSize: 18,
		fontFamily: 'Nexusa-Next',
	},
});
export default SlideView;
