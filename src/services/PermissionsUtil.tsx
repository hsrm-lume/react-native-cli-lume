import {
	Permission as AndroidPermissions,
	PermissionsAndroid,
	Platform,
} from 'react-native';
import {Rationale} from 'react-native';
import {
	request,
	check,
	PERMISSIONS,
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

export const mapPermission = (p: LumePermission): Permission => {
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
	new HandledPromise<void>(
		p === 'lume.permissons.camera'
			? 'camera.permission'
			: 'location.permission',
		(resolve, reject) => {
			let permission = mapPermission(p);
			Platform.OS === 'android'
				? PermissionsAndroid.check(permission as AndroidPermissions)
						.then(x => {
							if (x) return resolve();
							PermissionsAndroid.request(
								permission as AndroidPermissions,
								getRationale(p)
							).then(pResult => {
								if (pResult === 'granted') resolve();
								else reject(x);
							});
						})
						.catch(reject)
				: check(permission)
						.then(b => {
							console.log('b', b);
							if (b === 'granted') return resolve();

							request(permission, getRationale(p)).then(g => {
								console.log('g', g);
								if (g === 'granted') return resolve();
								return reject(g);
							});
						})
						.catch(() => {
							console.log('xDDDDD');
						});
		}
	);
