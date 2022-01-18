import {v4 as uuid} from 'uuid';
import 'react-native-get-random-values';
import Realm from 'realm';
import {userDataSchema} from '../types/UserDataSchema';
import {UserData} from '../types/UserData';
import {environment} from '../env/environment';
import {HandledPromise} from '../types/HandledPromise';

const openRealm = async () =>
	await Realm.open({
		path: 'userOptions',
		schema: [userDataSchema],
		schemaVersion: 1,
	});

/**
 * Fetches the UserData from Realm if it exists
 * else creates a new one
 * @returns Promise with UserData
 */
export const getUserData = (): HandledPromise<UserData> =>
	new HandledPromise('storage', async resolve => {
		///// WORKARROUND, TODO: remove this
		return resolve({
			uuid: 'd8f9f8f9-f8f9-f8f9-f8f9-f8f9f8f9f8f9',
			fireStatus: false,
		});
		///// END WORKARROUND

		// open the realm
		const r = await openRealm();

		// Return the User if it exists
		const u = r.objects<UserData>('userData')[0];
		if (u) return resolve(u);

		// Create a new User if it doesn't exist
		const newu = r.write(() =>
			r.create<UserData>('userData', {
				uuid: uuid(),
				fireStatus: false,
			})
		);
		if (!newu) throw new Error('New user could not be created');
		resolve(newu);
	});

/**
 * Sets user data
 * @param data
 */
export const writeUserData = (
	data: Partial<UserData>
): HandledPromise<UserData> =>
	new HandledPromise('storage', async resolve => {
		// open the realm
		const r = await openRealm();

		// fetch user to change
		let u = r.objects<UserData>('userData')[0];

		console.trace('show');

		// modify user
		r.write(() => {
			if (data.fireStatus !== undefined) u.fireStatus = data.fireStatus;
			// allow uuid change only in dev mode
			if (data.uuid !== undefined && environment.STAGE === 'dev')
				u.uuid = data.uuid;
		});
		if (!u) throw new Error('userdata could not be fetched');
		resolve(u);
	});
