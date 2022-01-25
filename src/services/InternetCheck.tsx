import NetInfo from '@react-native-community/netinfo';
import {Platform} from 'react-native';

export const checkConnected = (): Promise<boolean | null> => {
	return new Promise(resolve => {
		// For Android devices
		if (Platform.OS === 'android')
			NetInfo.fetch().then(state => {
				resolve(state.isInternetReachable);
			});
		// else {
		// 	// For iOS devices
		// 	const unsubscribe = NetInfo.addEventListener(state => {
		// 		unsubscribe();
		// 		resolve(state.isInternetReachable);
		// 	});
		// }
	});
};
