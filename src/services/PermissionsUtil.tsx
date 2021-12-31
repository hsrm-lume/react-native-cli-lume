import {PermissionsAndroid, Permission, Rationale} from 'react-native';
import {request, check, PERMISSIONS, RESULTS} from 'react-native-permissions';
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
export const getPermission = (p: Permission) =>
	new HandledPromise<void>((resolve, reject) => {
		check(p)
			.then(b => {
				if (b == RESULTS.GRANTED) return resolve();
				request(p)
					.then(g => {
						switch (g) {
							case RESULTS.UNAVAILABLE:
								reject(g + ' is Unavailable');
								break;
							case RESULTS.GRANTED:
							case RESULTS.LIMITED:
								resolve();
								break;
							case RESULTS.DENIED:
								reject('Permission ' + g + ' denied');
								break;

							case RESULTS.BLOCKED:
								reject('Permission ' + g + ' blocked');
								break;
							default:
								reject('Permission' + g + ': ' + p);
								break;
						}
					})
					.catch(reject);
			})
			.catch(reject);
	});
