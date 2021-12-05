import {v4 as uuid} from 'uuid';
import 'react-native-get-random-values';
import Realm from 'realm';
import {userDataSchema} from '../types/UserDataSchema';
import {UserData} from '../types/UserData';
import {environment} from '../env/environment';
import {HandledPromise} from '../types/HandledPromise';
class StorageService {
	realm?: Realm;

	async openRealm() {
		this.realm = await Realm.open({
			path: 'userOptions',
			schema: [userDataSchema],
			schemaVersion: 1,
		});
	}
	closeRealm() {
		// use when main component gets unmounted
		if (this.realm && !this.realm.isClosed) this.realm.close();
	}

	/**
	 * Fetches the UserData from Realm if it exists
	 * else creates a new one
	 * @returns Promise with UserData
	 */
	getUserData(): Promise<UserData> {
		return new HandledPromise((resolve, reject) => {
			// Reject if realm is not open
			if (!this.realm) return reject('Realm not open');

			// Return the User if it exists
			const u = this.realm.objects<UserData>('userData')[0];
			if (u) return resolve(u);

			// Create a new User if it doesn't exist
			this.realm.write(() => {
				const n = this.realm?.create<UserData>('userData', {
					uuid: uuid(),
					fireStatus: false,
				});
				if (!n) return reject('could not create user data');
				resolve(n);
			});
		});
	}

	/**
	 * Sets user data
	 * @param data
	 */
	writeUserData(data: UserData): HandledPromise<UserData> {
		return new HandledPromise((resolve, reject) => {
			// Reject if realm is not open
			if (!this.realm) return reject('Realm not open');

			// fetch user to change
			let u = this.realm.objects<UserData>('userData')[0];

			// modify user
			this.realm!.write(() => {
				u.fireStatus = data.fireStatus;
				// allow uuid change only in dev mode
				if (environment.STAGE == 'dev') u.uuid = data.uuid;
			});
			if (u) return resolve(u);
		});
	}

	// DEV PURPOSES ONLY
	wipeData() {
		this.realm?.write(() => {
			this.realm!.deleteAll();
		});
	}
	createAdmin(data: UserData) {
		return new HandledPromise((resolve, reject) => {
			// Reject if realm is not open
			if (!this.realm) return reject('Realm not open');
			this.wipeData();
			this.realm?.write(() => {
				const n = this.realm?.create<UserData>('userData', {
					fireStatus: data.fireStatus,
					uuid: data.uuid,
				});
				if (!n) return reject('could not create user data');
				resolve(n);
			});
		});
	}
	toConsole() {
		console.log('Full Realm');
		console.log(this.realm?.objects('userData'));
	}
}
export default StorageService;
