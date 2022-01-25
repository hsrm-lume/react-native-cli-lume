import React from 'react';
import {
	StyleProp,
	StyleSheet,
	TouchableHighlight,
	ViewStyle,
} from 'react-native';
import {SvgProps} from 'react-native-svg';

/**
 * @param item the ErrorMessage to display the icon for
 * @returns a jsx component that displays just the Error Icon
 */
export const Icon = (props: {
	icon: React.FC<SvgProps>;
	action?: (x?: any) => void;
	style?: StyleProp<ViewStyle>;
}) => (
	<TouchableHighlight
		style={[styles.icon, props.style]}
		underlayColor="#ffffff"
		onPress={props.action}>
		<props.icon width={'100%'} height={'100%'} />
	</TouchableHighlight>
);
const styles = StyleSheet.create({
	icon: {
		height: 50,
		width: 50,
		borderRadius: 25,
		justifyContent: 'center',
	},
});
