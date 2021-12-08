import Realm from 'realm';

export const userDataSchema: Realm.ObjectSchema = {
	name: 'userData',
	properties: {
		uuid: 'string',
		fireStatus: 'bool',
	},
	primaryKey: 'uuid',
};
