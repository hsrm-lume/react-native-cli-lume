import Realm from 'realm';
const userDataSchema: Realm.ObjectSchema = {
	name: 'userData',
	properties: {
		uuid: 'string',
		fireStatus: 'bool',
	},
	primaryKey: 'uuid',
};

export {userDataSchema};
