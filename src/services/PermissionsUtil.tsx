import {Platform} from 'react-native';
import {Rationale} from 'react-native';
import {
	request,
	check,
	PERMISSIONS,
	RESULTS,
	Permission,
} from 'react-native-permissions';
import {HandledPromise} from '../types/HandledPromise';

/**
 * Dict to store title and reason for each permission prompt
 */
type PermDescriptions = {
	// For each Permission store title and message for prompt
	[Key in LumePermission]?: {title: string; message: string};
};
const requiredPermissionDescriptions: PermDescriptions = {
	'lume.permissons.location': {
		title: 'Location Permission',
		message: 'Location permission is required to use this app.',
	},
	'lume.permissons.camera': {
		title: 'Camera Permission',
		message: 'Camera permission is required to use this app.',
	},
};

/**
 * lume Permission store in order to map the permissions
 * lume needs to the OS native permissions
 */
export type LumePermission =
	| 'lume.permissons.location'
	| 'lume.permissons.camera';

type LumePerm = {
	//Map each LumePermission to a ios and android permission
	[Key in LumePermission]: {ios: Permission; android: Permission};
};
/*
 * PermissionMap for the lume permissions to their
 * OS native counterparts
 */
const permissionMap: LumePerm = {
	'lume.permissons.camera': {
		ios: PERMISSIONS.IOS.CAMERA,
		android: PERMISSIONS.ANDROID.CAMERA,
	},
	'lume.permissons.location': {
		ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
		android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
	},
};

const mapPermission = (p: LumePermission): Permission => {
	return Platform.OS === 'android'
		? permissionMap[p].android
		: permissionMap[p].ios;
};

/**
 * Converts a lume permission to a rationale object
 * using the description from the requiredPermissionDescriptions object
 * @param p Permission to get rationale for
 * @returns Rationale object if it exists
 */
const getRationale = (p: LumePermission): Rationale | undefined => {
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

export const getPermission = (p: LumePermission) =>
	new HandledPromise<void>((resolve, reject) => {
		let permission = mapPermission(p);
		check(permission)
			.then(b => {
				if (b == RESULTS.GRANTED) return resolve();
				request(permission, getRationale(p))
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
