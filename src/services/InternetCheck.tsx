import NetInfo from '@react-native-community/netinfo';
import {HandledPromise} from '../types';

export const checkConnected = (): HandledPromise<void> => {
	return new HandledPromise('internet.device', (resolve, reject) => {
		const unsubscribe = NetInfo.addEventListener(state => {
			if (unsubscribe) unsubscribe();
			if (!state.isInternetReachable) reject(state);
			else resolve();
		});
	});
};
