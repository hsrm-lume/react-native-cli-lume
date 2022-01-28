import Realm from 'realm';

/**
 * Data associated to one device to manage states
 */
export interface UserData {
	fireStatus: boolean;
	uuid: string;
	firstAppUse: boolean;
}

/**
 * Schema for UserData interface to store it in a Realm
 */
export const userDataSchema: Realm.ObjectSchema = {
	name: 'userData',
	properties: {
		uuid: 'string',
		fireStatus: 'bool',
		firstAppUse: 'bool',
	},
	primaryKey: 'uuid',
};
