import {Platform} from 'react-native';
import {Rationale} from 'react-native';
import {
	request,
	check,
	PERMISSIONS,
	Permission,
} from 'react-native-permissions';
import {HandledPromise} from '../types/HandledPromise';

/**
 * lume internal Permission type containing keys for the needed permissions
 */
type LumePermission = 'lume.permissons.location' | 'lume.permissons.camera';

/**
 * Type to store title and reason for each permission prompt
 */
type PermDescriptions = {
	[Key in LumePermission]: {title: string; message: string; perm: Permission};
};
// Messages to use for the permission prompts
const requiredPermissions: PermDescriptions = {
	'lume.permissons.location': {
		title: 'Location Permission',
		message: 'Location permission is required to use this app.',
		perm:
			Platform.OS === 'android'
				? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
				: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
	},
	'lume.permissons.camera': {
		title: 'Camera Permission',
		message: 'Camera permission is required to use this app.',
		perm:
			Platform.OS === 'android'
				? PERMISSIONS.ANDROID.CAMERA
				: PERMISSIONS.IOS.CAMERA,
	},
};

/**
 * Converts a lume permission to a rationale object
 * using the description from the requiredPermissions object
 * @param p Permission to get rationale for
 * @returns Rationale object
 */
const getRationale = (p: LumePermission): Rationale => {
	return {
		...requiredPermissions[p],
		buttonNegative: 'Cancel',
		buttonPositive: 'OK',
	} as Rationale;
};

/**
 * @param p Permission to request
 * @returns Promise that resolves if permission is granted
 */
export const getPermission = (p: LumePermission) =>
	new HandledPromise<void>(
		// detect the messageKey from the permission
		p === 'lume.permissons.camera'
			? 'camera.permission'
			: 'location.permission',
		(resolve, reject) => {
			// get the permission data
			const permission = requiredPermissions[p];
			// check if its already granted
			check(permission.perm)
				.then(b => {
					// if yes, resolve
					if (b === 'granted') return resolve();
					// if not, request it
					request(permission.perm, getRationale(p)).then(g =>
						// resolve only if user has granted it
						g === 'granted' ? resolve() : reject(g)
					);
				})
				// if something goes wrong, reject the HandledPromise
				.catch(reject);
		}
	);
