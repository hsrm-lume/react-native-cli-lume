import NetInfo from '@react-native-community/netinfo';
import {Platform} from 'react-native';
import {HandledPromise} from '../types';

export const checkConnected = (): HandledPromise<void> => {
	return new HandledPromise('internet.device', (resolve, reject) => {
		const unsubscribe = NetInfo.addEventListener(state => {
			if (unsubscribe) unsubscribe();
			if (Platform.OS == 'ios' ? state.isConnected : state.isInternetReachable)
				resolve();
			else reject(state);
		});
	});
};
