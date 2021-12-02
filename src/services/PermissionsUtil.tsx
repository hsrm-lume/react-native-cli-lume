import {PermissionsAndroid, Permission, Rationale} from 'react-native';
import {HandledPromise} from '../types/HandledPromise';

/**
 * Dict to store title and reason for each permission prompt
 */
type PermDescriptions = {
	// For each Permission store title and message for prompt
	[Key in Permission]?: {title: string; message: string};
};
const requiredPermissionDescriptions: PermDescriptions = {
	'android.permission.ACCESS_FINE_LOCATION': {
		title: 'Location Permission',
		message: 'Location permission is required to use this app.',
	},
	'android.permission.CAMERA': {
		title: 'Camera Permission',
		message: 'Camera permission is required to use this app.',
	},
};

/**
 * Converts a permission to a rationale object
 * using the description from the requiredPermissionDescriptions object
 * @param p Permission to get rationale for
 * @returns Rationale object if it exists
 */
const getRationale = (p: Permission): Rationale | undefined => {
	if (!requiredPermissionDescriptions[p]) return undefined;
	return {
		...requiredPermissionDescriptions[p],
		buttonNegative: 'Cancel',
		buttonPositive: 'OK',
	} as Rationale;
};

/**
 * @param p Permission to request
 * @returns Promise that resolves if permission is granted
 */
const getPermission = async (p: Permission) =>
	new HandledPromise((resolve, reject) =>
		PermissionsAndroid.check(p).then(b => {
			if (b) return resolve(true);
			PermissionsAndroid.request(p, getRationale(p))
				.then(g => {
					if (g === 'granted') return resolve(true);
					reject('Permission ' + g + ': ' + p);
				})
				.catch(reject);
		})
	);

export default getPermission;
